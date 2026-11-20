import { Router, Request, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { repository, ContentType, ContentStatus } from '../db/repository';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { AuditService } from '../services/auditService';
import { DoiService } from '../services/doiService';
import { StorageService } from '../services/storageService';

export const studioRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

function getParam(req: Request, key: string): string {
  const val = req.params[key];
  return Array.isArray(val) ? val[0] : (val as string) || '';
}

// Protect ALL Studio routes with requireAuth
studioRouter.use(requireAuth);

// -------------------------------------------------------------
// 1. DASHBOARD OVERVIEW METRICS
// -------------------------------------------------------------
studioRouter.get(
  '/dashboard',
  requireRole(['super_admin', 'admin', 'editor', 'research_editor', 'author', 'media_manager']),
  (req: Request, res: Response) => {
    const metrics = repository.getDashboardMetrics();
    return res.json(metrics);
  }
);

// -------------------------------------------------------------
// 2. UNIFIED CONTENT MANAGEMENT
// -------------------------------------------------------------
studioRouter.get(
  '/content',
  requireRole(['super_admin', 'admin', 'editor', 'research_editor', 'author', 'media_manager']),
  (req: Request, res: Response) => {
    const { type, status, productId, authorId, q, limit, offset } = req.query;
    const result = repository.listContent({
      type: type as string,
      status: status as string,
      productId: productId as string,
      authorId: authorId as string,
      q: q as string,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    });
    return res.json(result);
  }
);

studioRouter.get(
  '/content/:id',
  requireRole(['super_admin', 'admin', 'editor', 'research_editor', 'author', 'media_manager']),
  (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const item = repository.getContentById(id);
    if (!item) {
      return res.status(404).json({ error: 'NotFound', message: `Content ${id} not found` });
    }
    const versions = repository.getContentVersions(id);
    return res.json({ item, versions });
  }
);

studioRouter.post(
  '/content',
  requireRole(['super_admin', 'admin', 'editor', 'author']),
  async (req: Request, res: Response) => {
    try {
      // Authors can only create drafts or submit for review
      if (req.user!.roleId === 'author' && req.body.status && !['draft', 'in_review'].includes(req.body.status)) {
        req.body.status = 'draft';
      }

      const item = repository.createContent(req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'content:create',
        resourceType: 'content',
        resourceId: item.id,
        details: { title: item.title, contentType: item.contentType, status: item.status },
      });
      return res.status(201).json(item);
    } catch (err: any) {
      return res.status(400).json({ error: 'CreateFailed', message: err.message });
    }
  }
);

studioRouter.put(
  '/content/:id',
  requireRole(['super_admin', 'admin', 'editor', 'author']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const existing = repository.getContentById(id);
    if (!existing) {
      return res.status(404).json({ error: 'NotFound', message: `Content ${id} not found` });
    }

    // Authors can only edit their own content
    if (req.user!.roleId === 'author') {
      if (existing.primaryAuthorId !== req.user!.id && existing.createdById !== req.user!.id) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Authors are only authorized to edit their own articles.',
        });
      }
      // Authors cannot directly publish
      if (req.body.status === 'published') {
        delete req.body.status;
      }
    }

    try {
      const { changelog, ...updates } = req.body;
      const item = repository.updateContent(id, updates, req.user!.id, changelog);
      await AuditService.log({
        userId: req.user!.id,
        action: 'content:update',
        resourceType: 'content',
        resourceId: item.id,
        details: { title: item.title, status: item.status, changelog },
      });
      return res.json(item);
    } catch (err: any) {
      return res.status(400).json({ error: 'UpdateFailed', message: err.message });
    }
  }
);

studioRouter.post(
  '/content/:id/status',
  requireRole(['super_admin', 'admin', 'editor', 'author']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const { status, notes } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'InvalidStatus', message: 'Status is required' });
    }

    // Authors can only transition content between 'draft' and 'in_review'
    if (req.user!.roleId === 'author') {
      if (!['draft', 'in_review'].includes(status)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Authors cannot directly approve or publish content without editorial sign-off.',
        });
      }
    }

    try {
      const item = repository.updateContentStatus(id, status as ContentStatus, req.user!.id, notes);
      await AuditService.log({
        userId: req.user!.id,
        action: `content:status_${status}`,
        resourceType: 'content',
        resourceId: item.id,
        details: { newStatus: status, notes },
      });
      return res.json(item);
    } catch (err: any) {
      return res.status(400).json({ error: 'StatusUpdateFailed', message: err.message });
    }
  }
);

studioRouter.post(
  '/content/:id/duplicate',
  requireRole(['super_admin', 'admin', 'editor', 'author']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    try {
      const duplicate = repository.duplicateContent(id, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'content:duplicate',
        resourceType: 'content',
        resourceId: duplicate.id,
        details: { sourceId: id, newId: duplicate.id },
      });
      return res.status(201).json(duplicate);
    } catch (err: any) {
      return res.status(400).json({ error: 'DuplicateFailed', message: err.message });
    }
  }
);

studioRouter.post(
  '/content/:id/restore-version',
  requireRole(['super_admin', 'admin', 'editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const { versionId } = req.body;
    if (!versionId) return res.status(400).json({ error: 'VersionRequired', message: 'versionId required' });
    try {
      const restored = repository.restoreContentVersion(id, versionId, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'content:restore_version',
        resourceType: 'content',
        resourceId: id,
        details: { restoredVersionId: versionId },
      });
      return res.json(restored);
    } catch (err: any) {
      return res.status(400).json({ error: 'RestoreFailed', message: err.message });
    }
  }
);

studioRouter.delete(
  '/content/:id',
  requireRole(['super_admin', 'admin', 'editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const deleted = repository.deleteContent(id);
    if (!deleted) {
      return res.status(404).json({ error: 'NotFound', message: `Content ${id} not found` });
    }
    await AuditService.log({
      userId: req.user!.id,
      action: 'content:delete',
      resourceType: 'content',
      resourceId: id,
    });
    return res.json({ success: true, deletedId: id });
  }
);

// -------------------------------------------------------------
// 3. PRODUCT SPECIFICATIONS MANAGEMENT
// -------------------------------------------------------------
studioRouter.get('/products', (req: Request, res: Response) => {
  const products = repository.listProducts(false);
  return res.json(products);
});

studioRouter.get('/products/:id', (req: Request, res: Response) => {
  const id = getParam(req, 'id');
  const product = repository.getProductById(id) || repository.getProductBySlug(id);
  if (!product) {
    return res.status(404).json({ error: 'NotFound', message: 'Product not found' });
  }
  return res.json(product);
});

studioRouter.post(
  '/products',
  requireRole(['super_admin', 'admin']),
  async (req: Request, res: Response) => {
    try {
      const product = repository.createProduct(req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'product:create',
        resourceType: 'product',
        resourceId: product.id,
        details: { name: product.name, status: product.status },
      });
      return res.status(201).json(product);
    } catch (err: any) {
      return res.status(400).json({ error: 'CreateFailed', message: err.message });
    }
  }
);

studioRouter.put(
  '/products/:id',
  requireRole(['super_admin', 'admin']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    try {
      const product = repository.updateProduct(id, req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'product:update',
        resourceType: 'product',
        resourceId: product.id,
        details: { name: product.name, status: product.status },
      });
      return res.json(product);
    } catch (err: any) {
      return res.status(400).json({ error: 'UpdateFailed', message: err.message });
    }
  }
);

studioRouter.patch(
  '/products/:id',
  requireRole(['super_admin', 'admin']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    try {
      const product = repository.updateProduct(id, req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'product:patch',
        resourceType: 'product',
        resourceId: product.id,
        details: { name: product.name, status: product.status },
      });
      return res.json(product);
    } catch (err: any) {
      return res.status(400).json({ error: 'UpdateFailed', message: err.message });
    }
  }
);

// Review & Approval Workflow for Products
studioRouter.patch(
  '/products/:id/review',
  requireRole(['super_admin', 'editor', 'research_editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const { status, notes } = req.body; // 'approved' | 'revision_requested' | 'rejected'
    const product = repository.getProductById(id) || repository.getProductBySlug(id);
    if (!product) {
      return res.status(404).json({ error: 'NotFound', message: 'Product not found' });
    }

    try {
      const updated = repository.updateProduct(
        product.id,
        {
          editorialStatus: status || 'approved',
          reviewNotes: notes,
          approvedBy: req.user!.id,
        },
        req.user!.id
      );

      await AuditService.log({
        userId: req.user!.id,
        action: 'product:reviewed',
        resourceType: 'product',
        resourceId: product.id,
        details: { decision: status || 'approved', reviewer: req.user!.name, notes },
      });

      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: 'ReviewFailed', message: err.message });
    }
  }
);

// Publish Product Workflow
studioRouter.patch(
  '/products/:id/publish',
  requireRole(['super_admin', 'admin']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const product = repository.getProductById(id) || repository.getProductBySlug(id);
    if (!product) {
      return res.status(404).json({ error: 'NotFound', message: 'Product not found' });
    }

    try {
      const updated = repository.updateProduct(
        product.id,
        {
          isPublished: true,
          editorialStatus: 'published',
        },
        req.user!.id
      );

      await AuditService.log({
        userId: req.user!.id,
        action: 'product:publish',
        resourceType: 'product',
        resourceId: product.id,
        details: { name: product.name },
      });

      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: 'PublishFailed', message: err.message });
    }
  }
);

// Unpublish Product Workflow
studioRouter.patch(
  '/products/:id/unpublish',
  requireRole(['super_admin', 'admin']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const product = repository.getProductById(id) || repository.getProductBySlug(id);
    if (!product) {
      return res.status(404).json({ error: 'NotFound', message: 'Product not found' });
    }

    try {
      const updated = repository.updateProduct(
        product.id,
        {
          isPublished: false,
          editorialStatus: 'draft',
        },
        req.user!.id
      );

      await AuditService.log({
        userId: req.user!.id,
        action: 'product:unpublish',
        resourceType: 'product',
        resourceId: product.id,
        details: { name: product.name },
      });

      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: 'UnpublishFailed', message: err.message });
    }
  }
);

// Product Version History
studioRouter.get(
  '/products/:id/versions',
  (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const product = repository.getProductById(id) || repository.getProductBySlug(id);
    if (!product) {
      return res.status(404).json({ error: 'NotFound', message: 'Product not found' });
    }
    return res.json(product.versions || []);
  }
);

studioRouter.post(
  '/products/reorder',
  requireRole(['super_admin', 'admin']),
  async (req: Request, res: Response) => {
    const { orderIds } = req.body;
    if (!Array.isArray(orderIds)) {
      return res.status(400).json({ error: 'InvalidOrder', message: 'orderIds must be an array' });
    }
    const products = repository.reorderProducts(orderIds);
    await AuditService.log({
      userId: req.user!.id,
      action: 'product:reorder',
      resourceType: 'product',
      details: { orderIds },
    });
    return res.json(products);
  }
);

studioRouter.delete(
  '/products/:id',
  requireRole(['super_admin', 'admin']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const deleted = repository.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: 'NotFound', message: 'Product not found' });
    }
    await AuditService.log({
      userId: req.user!.id,
      action: 'product:delete',
      resourceType: 'product',
      resourceId: id,
    });
    return res.json({ success: true, deletedId: id });
  }
);

// -------------------------------------------------------------
// 4. ENGINEERING CONTENT MANAGEMENT
// -------------------------------------------------------------
studioRouter.get('/engineering', (req: Request, res: Response) => {
  const articles = repository.listEngineeringArticles(false);
  return res.json(articles);
});

studioRouter.post(
  '/engineering',
  requireRole(['super_admin', 'admin', 'editor']),
  async (req: Request, res: Response) => {
    try {
      const article = repository.createEngineeringArticle(req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'engineering:create',
        resourceType: 'engineering_article',
        resourceId: article.id,
        details: { title: article.title, category: article.category },
      });
      return res.status(201).json(article);
    } catch (err: any) {
      return res.status(400).json({ error: 'CreateFailed', message: err.message });
    }
  }
);

studioRouter.put(
  '/engineering/:id',
  requireRole(['super_admin', 'admin', 'editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    try {
      const article = repository.updateEngineeringArticle(id, req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'engineering:update',
        resourceType: 'engineering_article',
        resourceId: article.id,
        details: { title: article.title, status: article.status },
      });
      return res.json(article);
    } catch (err: any) {
      return res.status(400).json({ error: 'UpdateFailed', message: err.message });
    }
  }
);

studioRouter.delete(
  '/engineering/:id',
  requireRole(['super_admin', 'admin', 'editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const deleted = repository.deleteEngineeringArticle(id);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'Article not found' });
    await AuditService.log({
      userId: req.user!.id,
      action: 'engineering:delete',
      resourceType: 'engineering_article',
      resourceId: id,
    });
    return res.json({ success: true, deletedId: id });
  }
);

// -------------------------------------------------------------
// 5. RESEARCH PAPERS & DOI VERIFICATION
// -------------------------------------------------------------
studioRouter.get('/research', (req: Request, res: Response) => {
  const papers = repository.listResearchPapers(false);
  return res.json(papers);
});

studioRouter.post(
  '/research',
  requireRole(['super_admin', 'admin', 'research_editor']),
  async (req: Request, res: Response) => {
    try {
      const paper = repository.createResearchPaper(req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'research:create',
        resourceType: 'research_paper',
        resourceId: paper.id,
        details: { title: paper.title, doi: paper.doi },
      });
      return res.status(201).json(paper);
    } catch (err: any) {
      return res.status(400).json({ error: 'CreateFailed', message: err.message });
    }
  }
);

studioRouter.put(
  '/research/:id',
  requireRole(['super_admin', 'admin', 'research_editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    try {
      const paper = repository.updateResearchPaper(id, req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'research:update',
        resourceType: 'research_paper',
        resourceId: paper.id,
        details: { title: paper.title, doi: paper.doi },
      });
      return res.json(paper);
    } catch (err: any) {
      return res.status(400).json({ error: 'UpdateFailed', message: err.message });
    }
  }
);

studioRouter.post(
  '/research/:id/verify-doi',
  requireRole(['super_admin', 'admin', 'research_editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const paper = repository.getResearchPaperById(id);
    if (!paper) return res.status(404).json({ error: 'NotFound', message: 'Paper not found' });

    if (!paper.doi) {
      return res.status(400).json({ error: 'NoDoi', message: 'Paper does not have a DOI assigned' });
    }

    const result = await DoiService.verifyDoi(paper.doi);
    const isVerified = result.publicationStatus === 'verified';
    const updated = repository.updateResearchPaper(
      paper.id,
      {
        isDoiVerified: isVerified,
        doiVerificationSource: result.sourceProvenance,
        doiVerificationNotes: result.verificationNotes,
        sourceVerificationStatus: isVerified ? 'verified' : 'demonstration',
      },
      req.user!.id
    );

    await AuditService.log({
      userId: req.user!.id,
      action: 'research:verify_doi',
      resourceType: 'research_paper',
      resourceId: paper.id,
      details: { doi: paper.doi, isVerified, source: result.sourceProvenance },
    });

    return res.json({ paper: updated, verificationResult: result });
  }
);

studioRouter.delete(
  '/research/:id',
  requireRole(['super_admin', 'admin', 'research_editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const deleted = repository.deleteResearchPaper(id);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'Paper not found' });
    await AuditService.log({
      userId: req.user!.id,
      action: 'research:delete',
      resourceType: 'research_paper',
      resourceId: id,
    });
    return res.json({ success: true, deletedId: id });
  }
);

// -------------------------------------------------------------
// 6. UPDATES AND CHANGELOG
// -------------------------------------------------------------
studioRouter.get('/updates', (req: Request, res: Response) => {
  const updates = repository.listUpdates(false);
  return res.json(updates);
});

studioRouter.post(
  '/updates',
  requireRole(['super_admin', 'admin', 'editor']),
  async (req: Request, res: Response) => {
    try {
      const update = repository.createUpdate(req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'update:create',
        resourceType: 'company_update',
        resourceId: update.id,
        details: { title: update.title, category: update.category },
      });
      return res.status(201).json(update);
    } catch (err: any) {
      return res.status(400).json({ error: 'CreateFailed', message: err.message });
    }
  }
);

studioRouter.put(
  '/updates/:id',
  requireRole(['super_admin', 'admin', 'editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    try {
      const update = repository.updateUpdate(id, req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'update:update',
        resourceType: 'company_update',
        resourceId: update.id,
        details: { title: update.title, status: update.status },
      });
      return res.json(update);
    } catch (err: any) {
      return res.status(400).json({ error: 'UpdateFailed', message: err.message });
    }
  }
);

studioRouter.delete(
  '/updates/:id',
  requireRole(['super_admin', 'admin', 'editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const deleted = repository.deleteUpdate(id);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'Update not found' });
    await AuditService.log({
      userId: req.user!.id,
      action: 'update:delete',
      resourceType: 'company_update',
      resourceId: id,
    });
    return res.json({ success: true, deletedId: id });
  }
);

// -------------------------------------------------------------
// 7. MEDIA LIBRARY
// -------------------------------------------------------------
studioRouter.get(
  '/media',
  requireRole(['super_admin', 'admin', 'editor', 'research_editor', 'author', 'media_manager']),
  (req: Request, res: Response) => {
    const { format, q } = req.query;
    const list = repository.listMediaAssets({ format: format as string, q: q as string });
    return res.json(list);
  }
);

// Multipart Media File Upload (Images, Screenshots, Videos, Documents)
studioRouter.post(
  '/media/upload',
  requireRole(['super_admin', 'admin', 'media_manager', 'editor', 'author']),
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'MissingFile', message: 'No file provided in form field "file"' });
      }

      const uploadResult = await StorageService.saveUploadedFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        'media'
      );

      const format = uploadResult.mimeType.startsWith('image/')
        ? ('image' as const)
        : uploadResult.mimeType.startsWith('video/')
        ? ('video' as const)
        : uploadResult.mimeType.startsWith('audio/')
        ? ('audio' as const)
        : ('pdf' as const);

      const asset = repository.createMediaAsset(
        {
          title: req.body.title || req.file.originalname,
          originalFilename: req.file.originalname,
          altText: req.body.altText || req.file.originalname,
          caption: req.body.caption,
          coverImageUrl: uploadResult.fileUrl,
          fileUrl: uploadResult.fileUrl,
          format,
          fileType: uploadResult.mimeType,
          fileSizeBytes: uploadResult.sizeBytes,
          width: uploadResult.width,
          height: uploadResult.height,
          durationSeconds: uploadResult.durationSeconds || 0,
          durationLabel: uploadResult.durationSeconds ? `${uploadResult.durationSeconds}s` : '0:00',
          speaker: req.body.speaker || '',
          speakerRole: req.body.speakerRole || '',
          description: req.body.description || '',
          isStreamAvailable: format === 'video' || format === 'audio',
        },
        req.user!.id
      );

      await AuditService.log({
        userId: req.user!.id,
        action: 'media:upload_file',
        resourceType: 'media_asset',
        resourceId: asset.id,
        details: { filename: req.file.originalname, url: uploadResult.fileUrl, provider: uploadResult.storageProvider },
      });

      return res.status(201).json({
        upload: uploadResult,
        asset,
      });
    } catch (err: any) {
      return res.status(400).json({ error: 'UploadError', message: err.message });
    }
  }
);

studioRouter.post(
  '/media',
  requireRole(['super_admin', 'admin', 'media_manager', 'editor']),
  async (req: Request, res: Response) => {
    try {
      const asset = repository.createMediaAsset(req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'media:upload',
        resourceType: 'media_asset',
        resourceId: asset.id,
        details: { title: asset.title, format: asset.format },
      });
      return res.status(201).json(asset);
    } catch (err: any) {
      return res.status(400).json({ error: 'UploadFailed', message: err.message });
    }
  }
);

studioRouter.put(
  '/media/:id',
  requireRole(['super_admin', 'admin', 'media_manager', 'editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    try {
      const asset = repository.updateMediaAsset(id, req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'media:update',
        resourceType: 'media_asset',
        resourceId: asset.id,
        details: { title: asset.title },
      });
      return res.json(asset);
    } catch (err: any) {
      return res.status(400).json({ error: 'UpdateFailed', message: err.message });
    }
  }
);

studioRouter.delete(
  '/media/:id',
  requireRole(['super_admin', 'admin', 'media_manager', 'editor']),
  async (req: Request, res: Response) => {
    const id = getParam(req, 'id');
    const deleted = repository.deleteMediaAsset(id);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'Asset not found' });
    await AuditService.log({
      userId: req.user!.id,
      action: 'media:delete',
      resourceType: 'media_asset',
      resourceId: id,
    });
    return res.json({ success: true, deletedId: id });
  }
);

// -------------------------------------------------------------
// 8. STATIC PAGES MANAGEMENT
// -------------------------------------------------------------
studioRouter.get('/pages', (req: Request, res: Response) => {
  const pages = repository.listStaticPages();
  return res.json(pages);
});

studioRouter.get('/pages/:slug', (req: Request, res: Response) => {
  const slug = getParam(req, 'slug');
  const page = repository.getStaticPageBySlug(slug);
  if (!page) return res.status(404).json({ error: 'NotFound', message: 'Page not found' });
  return res.json(page);
});

studioRouter.post(
  '/pages',
  requireRole(['super_admin', 'admin', 'editor']),
  async (req: Request, res: Response) => {
    try {
      const page = repository.saveStaticPage(req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'page:save',
        resourceType: 'static_page',
        resourceId: page.slug,
        details: { title: page.title, status: page.status },
      });
      return res.status(200).json(page);
    } catch (err: any) {
      return res.status(400).json({ error: 'SaveFailed', message: err.message });
    }
  }
);

studioRouter.delete(
  '/pages/:slug',
  requireRole(['super_admin', 'admin']),
  async (req: Request, res: Response) => {
    const slug = getParam(req, 'slug');
    const deleted = repository.deleteStaticPage(slug);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'Page not found' });
    await AuditService.log({
      userId: req.user!.id,
      action: 'page:delete',
      resourceType: 'static_page',
      resourceId: slug,
    });
    return res.json({ success: true, deletedSlug: slug });
  }
);

// -------------------------------------------------------------
// 9. NAVIGATION MENUS
// -------------------------------------------------------------
studioRouter.get('/navigation', (req: Request, res: Response) => {
  const menus = repository.listNavigationMenus();
  return res.json(menus);
});

studioRouter.put(
  '/navigation/:location',
  requireRole(['super_admin', 'admin']),
  async (req: Request, res: Response) => {
    const loc = getParam(req, 'location') as 'main' | 'footer' | 'product';
    if (!['main', 'footer', 'product'].includes(loc)) {
      return res.status(400).json({ error: 'InvalidLocation', message: 'Location must be main, footer, or product' });
    }
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'InvalidPayload', message: 'items must be an array' });
    }
    const menu = repository.saveNavigationMenu(loc, items, req.user!.id);
    await AuditService.log({
      userId: req.user!.id,
      action: 'navigation:update',
      resourceType: 'navigation_menu',
      resourceId: loc,
      details: { itemCount: items.length },
    });
    return res.json(menu);
  }
);

// -------------------------------------------------------------
// 10. HOMEPAGE BUILDER CONFIG
// -------------------------------------------------------------
studioRouter.get('/homepage', (req: Request, res: Response) => {
  const config = repository.getHomepageConfig();
  return res.json(config);
});

studioRouter.put(
  '/homepage',
  requireRole(['super_admin', 'admin']),
  async (req: Request, res: Response) => {
    try {
      const config = repository.saveHomepageConfig(req.body, req.user!.id);
      await AuditService.log({
        userId: req.user!.id,
        action: 'homepage:update',
        resourceType: 'homepage_config',
        details: { heroHeadline: config.heroHeadline, sectionCount: config.sectionsConfig.length },
      });
      return res.json(config);
    } catch (err: any) {
      return res.status(400).json({ error: 'HomepageUpdateFailed', message: err.message });
    }
  }
);

// -------------------------------------------------------------
// 11. NEWSLETTER SUBSCRIBERS
// -------------------------------------------------------------
studioRouter.get(
  '/newsletter',
  requireRole(['super_admin', 'admin', 'editor']),
  (req: Request, res: Response) => {
    const subscribers = Array.from(repository.subscribers.values()).map((s) => ({
      id: s.id,
      email: s.email,
      isConfirmed: s.isConfirmed,
      consentRecordedAt: s.consentRecordedAt,
      unsubscribedAt: s.unsubscribedAt,
    }));
    return res.json({ total: subscribers.length, subscribers });
  }
);

studioRouter.get(
  '/newsletter/export',
  requireRole(['super_admin', 'admin', 'editor']),
  (req: Request, res: Response) => {
    const list = Array.from(repository.subscribers.values());
    const header = 'ID,Email,Confirmed,ConsentTimestamp,UnsubscribedTimestamp\n';
    const rows = list
      .map(
        (s) =>
          `${s.id},"${s.email}",${s.isConfirmed},"${s.consentRecordedAt}","${s.unsubscribedAt || ''}"`
      )
      .join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers_export.csv"');
    return res.send(header + rows);
  }
);

// -------------------------------------------------------------
// 12. ANALYTICS & INSIGHTS
// -------------------------------------------------------------
studioRouter.get(
  '/analytics',
  requireRole(['super_admin', 'admin', 'editor', 'research_editor']),
  (req: Request, res: Response) => {
    const papers = Array.from(repository.researchPapers.values());
    const totalDownloads = papers.reduce((sum, p) => sum + p.downloadCount, 0);
    const totalBookmarks = repository.bookmarks.size;
    const contentByType: Record<string, number> = {};
    for (const c of repository.content.values()) {
      contentByType[c.contentType] = (contentByType[c.contentType] || 0) + 1;
    }

    return res.json({
      metrics: {
        totalDownloads,
        totalBookmarks,
        confirmedSubscribers: Array.from(repository.subscribers.values()).filter((s) => s.isConfirmed).length,
        publishedContentTotal: Array.from(repository.content.values()).filter((c) => c.status === 'published').length,
      },
      topDownloadedPapers: papers.sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 5),
      contentDistribution: contentByType,
    });
  }
);

// -------------------------------------------------------------
// 13. USER & ROLE MANAGEMENT
// -------------------------------------------------------------
studioRouter.get('/users', requireRole(['super_admin', 'admin']), (req: Request, res: Response) => {
  const users = repository.listUsers();
  return res.json(users);
});

studioRouter.post('/users', requireRole(['super_admin', 'admin']), async (req: Request, res: Response) => {
  try {
    // Only super_admin can create another admin or super_admin
    if (['super_admin', 'admin'].includes(req.body.roleId) && req.user!.roleId !== 'super_admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only Super Administrators can provision administrative accounts.',
      });
    }

    const user = repository.createUser(req.body, req.user!.id);
    await AuditService.log({
      userId: req.user!.id,
      action: 'user:create',
      resourceType: 'user',
      resourceId: user.id,
      details: { email: user.email, roleId: user.roleId },
    });
    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(400).json({ error: 'CreateUserFailed', message: err.message });
  }
});

studioRouter.put('/users/:id/role', requireRole(['super_admin', 'admin']), async (req: Request, res: Response) => {
  const id = getParam(req, 'id');
  const { roleId } = req.body;
  if (!roleId) return res.status(400).json({ error: 'InvalidRole', message: 'roleId is required' });

  // Only super_admin can grant or revoke super_admin role
  if ((roleId === 'super_admin' || id === req.user!.id) && req.user!.roleId !== 'super_admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Only Super Administrators can modify Super Admin permissions.',
    });
  }

  try {
    const updated = repository.updateUserRole(id, roleId, req.user!.id);
    await AuditService.log({
      userId: req.user!.id,
      action: 'user:update_role',
      resourceType: 'user',
      resourceId: updated.id,
      details: { newRole: roleId },
    });
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: 'RoleUpdateFailed', message: err.message });
  }
});

studioRouter.delete('/users/:id', requireRole(['super_admin']), async (req: Request, res: Response) => {
  const id = getParam(req, 'id');
  try {
    const deleted = repository.deleteUser(id);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
    await AuditService.log({
      userId: req.user!.id,
      action: 'user:delete',
      resourceType: 'user',
      resourceId: id,
    });
    return res.json({ success: true, deletedId: id });
  } catch (err: any) {
    return res.status(400).json({ error: 'DeleteFailed', message: err.message });
  }
});

// -------------------------------------------------------------
// 14. GLOBAL WEBSITE SETTINGS
// -------------------------------------------------------------
studioRouter.get('/settings', requireRole(['super_admin', 'admin']), (req: Request, res: Response) => {
  const settings = repository.getSiteSettings();
  return res.json(settings);
});

studioRouter.put('/settings', requireRole(['super_admin']), async (req: Request, res: Response) => {
  try {
    const updated = repository.saveSiteSettings(req.body, req.user!.id);
    await AuditService.log({
      userId: req.user!.id,
      action: 'settings:update',
      resourceType: 'site_settings',
      details: { siteTitle: updated.siteTitle },
    });
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: 'SettingsUpdateFailed', message: err.message });
  }
});

// -------------------------------------------------------------
// 15. AUDIT TRAIL
// -------------------------------------------------------------
studioRouter.get('/audit', requireRole(['super_admin']), (req: Request, res: Response) => {
  const limit = parseInt((req.query.limit as string) || '100', 10);
  const logs = AuditService.getRecentLogs(limit);
  return res.json({ total: logs.length, logs });
});
