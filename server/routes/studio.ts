import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { repository, ContentType, ContentStatus } from '../db/repository';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { AuditService } from '../services/auditService';
import { DoiService } from '../services/doiService';

export const studioRouter = Router();

function getParam(req: Request, key: string): string {
  const val = req.params[key];
  return Array.isArray(val) ? val[0] : (val as string) || '';
}

// Protect ALL Studio routes with requireAuth
studioRouter.use(requireAuth);

// -------------------------------------------------------------
// 1. DASHBOARD OVERVIEW METRICS
// -------------------------------------------------------------
studioRouter.get('/dashboard', (req: Request, res: Response) => {
  const metrics = repository.getDashboardMetrics();
  return res.json(metrics);
});

// -------------------------------------------------------------
// 2. UNIFIED CONTENT MANAGEMENT
// -------------------------------------------------------------
studioRouter.get('/content', (req: Request, res: Response) => {
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
});

studioRouter.get('/content/:id', (req: Request, res: Response) => {
  const id = getParam(req, 'id');
  const item = repository.getContentById(id);
  if (!item) {
    return res.status(404).json({ error: 'NotFound', message: `Content ${id} not found` });
  }
  const versions = repository.getContentVersions(id);
  return res.json({ item, versions });
});

studioRouter.post('/content', async (req: Request, res: Response) => {
  try {
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
});

studioRouter.put('/content/:id', async (req: Request, res: Response) => {
  const id = getParam(req, 'id');
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
});

studioRouter.post('/content/:id/status', async (req: Request, res: Response) => {
  const id = getParam(req, 'id');
  const { status, notes } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'InvalidStatus', message: 'Status is required' });
  }
  try {
    const item = repository.updateContentStatus(id, status as ContentStatus, req.user!.id, notes);
    await AuditService.log({
      userId: req.user!.id,
      action: `content:status_${status}`,
      resourceType: 'content',
      resourceId: item.id,
      details: { previousStatus: item.status, newStatus: status, notes },
    });
    return res.json(item);
  } catch (err: any) {
    return res.status(400).json({ error: 'StatusUpdateFailed', message: err.message });
  }
});

studioRouter.post('/content/:id/duplicate', async (req: Request, res: Response) => {
  const id = getParam(req, 'id');
  try {
    const duplicated = repository.duplicateContent(id, req.user!.id);
    await AuditService.log({
      userId: req.user!.id,
      action: 'content:duplicate',
      resourceType: 'content',
      resourceId: duplicated.id,
      details: { originalId: id, newTitle: duplicated.title },
    });
    return res.status(201).json(duplicated);
  } catch (err: any) {
    return res.status(400).json({ error: 'DuplicateFailed', message: err.message });
  }
});

studioRouter.delete('/content/:id', async (req: Request, res: Response) => {
  const id = getParam(req, 'id');
  const deleted = repository.deleteContent(id);
  if (!deleted) {
    return res.status(404).json({ error: 'NotFound', message: 'Content not found' });
  }
  await AuditService.log({
    userId: req.user!.id,
    action: 'content:delete',
    resourceType: 'content',
    resourceId: id,
  });
  return res.json({ success: true, deletedId: id });
});

// -------------------------------------------------------------
// 3. PRODUCT MANAGEMENT
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

studioRouter.post('/products', async (req: Request, res: Response) => {
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
    return res.status(400).json({ error: 'ProductCreateFailed', message: err.message });
  }
});

studioRouter.put('/products/:id', async (req: Request, res: Response) => {
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
    return res.status(400).json({ error: 'ProductUpdateFailed', message: err.message });
  }
});

studioRouter.post('/products/reorder', async (req: Request, res: Response) => {
  const { orderIds } = req.body;
  if (!Array.isArray(orderIds)) {
    return res.status(400).json({ error: 'InvalidPayload', message: 'orderIds must be an array of IDs' });
  }
  const products = repository.reorderProducts(orderIds);
  await AuditService.log({
    userId: req.user!.id,
    action: 'product:reorder',
    resourceType: 'product',
    details: { orderIds },
  });
  return res.json(products);
});

studioRouter.delete('/products/:id', async (req: Request, res: Response) => {
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
});

// -------------------------------------------------------------
// 4. ENGINEERING CONTENT MANAGEMENT
// -------------------------------------------------------------
studioRouter.get('/engineering', (req: Request, res: Response) => {
  const articles = repository.listEngineeringArticles(false);
  return res.json(articles);
});

studioRouter.post('/engineering', async (req: Request, res: Response) => {
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
});

studioRouter.put('/engineering/:id', async (req: Request, res: Response) => {
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
});

studioRouter.delete('/engineering/:id', async (req: Request, res: Response) => {
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
});

// -------------------------------------------------------------
// 5. RESEARCH PAPERS & DOI VERIFICATION
// -------------------------------------------------------------
studioRouter.get('/research', (req: Request, res: Response) => {
  const papers = repository.listResearchPapers(false);
  return res.json(papers);
});

studioRouter.post('/research', async (req: Request, res: Response) => {
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
});

studioRouter.put('/research/:id', async (req: Request, res: Response) => {
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
});

studioRouter.post('/research/:id/verify-doi', async (req: Request, res: Response) => {
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
});

studioRouter.delete('/research/:id', async (req: Request, res: Response) => {
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
});

// -------------------------------------------------------------
// 6. UPDATES AND CHANGELOG
// -------------------------------------------------------------
studioRouter.get('/updates', (req: Request, res: Response) => {
  const updates = repository.listUpdates(false);
  return res.json(updates);
});

studioRouter.post('/updates', async (req: Request, res: Response) => {
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
});

studioRouter.put('/updates/:id', async (req: Request, res: Response) => {
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
});

studioRouter.delete('/updates/:id', async (req: Request, res: Response) => {
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
});

// -------------------------------------------------------------
// 7. MEDIA LIBRARY
// -------------------------------------------------------------
studioRouter.get('/media', (req: Request, res: Response) => {
  const { format, q } = req.query;
  const list = repository.listMediaAssets({ format: format as string, q: q as string });
  return res.json(list);
});

studioRouter.post('/media', async (req: Request, res: Response) => {
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
});

studioRouter.put('/media/:id', async (req: Request, res: Response) => {
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
});

studioRouter.delete('/media/:id', async (req: Request, res: Response) => {
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
});

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

studioRouter.post('/pages', async (req: Request, res: Response) => {
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
});

studioRouter.delete('/pages/:slug', async (req: Request, res: Response) => {
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
});

// -------------------------------------------------------------
// 9. NAVIGATION MENUS
// -------------------------------------------------------------
studioRouter.get('/navigation', (req: Request, res: Response) => {
  const menus = repository.listNavigationMenus();
  return res.json(menus);
});

studioRouter.put('/navigation/:location', async (req: Request, res: Response) => {
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
});

// -------------------------------------------------------------
// 10. HOMEPAGE BUILDER CONFIG
// -------------------------------------------------------------
studioRouter.get('/homepage', (req: Request, res: Response) => {
  const config = repository.getHomepageConfig();
  return res.json(config);
});

studioRouter.put('/homepage', async (req: Request, res: Response) => {
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
});

// -------------------------------------------------------------
// 11. NEWSLETTER SUBSCRIBERS
// -------------------------------------------------------------
studioRouter.get('/newsletter', (req: Request, res: Response) => {
  const subscribers = Array.from(repository.subscribers.values()).map((s) => ({
    id: s.id,
    email: s.email,
    isConfirmed: s.isConfirmed,
    consentRecordedAt: s.consentRecordedAt,
    unsubscribedAt: s.unsubscribedAt,
  }));
  return res.json({ total: subscribers.length, subscribers });
});

studioRouter.get('/newsletter/export', (req: Request, res: Response) => {
  const list = Array.from(repository.subscribers.values());
  const header = 'ID,Email,Confirmed,ConsentTimestamp,UnsubscribedTimestamp\n';
  const rows = list.map((s) => `${s.id},"${s.email}",${s.isConfirmed},"${s.consentRecordedAt}","${s.unsubscribedAt || ''}"`).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="subscribers_export.csv"');
  return res.send(header + rows);
});

// -------------------------------------------------------------
// 12. ANALYTICS & INSIGHTS
// -------------------------------------------------------------
studioRouter.get('/analytics', (req: Request, res: Response) => {
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
});

// -------------------------------------------------------------
// 13. USER & ROLE MANAGEMENT
// -------------------------------------------------------------
studioRouter.get('/users', requireRole(['super_admin', 'admin']), (req: Request, res: Response) => {
  const users = repository.listUsers();
  return res.json(users);
});

studioRouter.post('/users', requireRole(['super_admin', 'admin']), async (req: Request, res: Response) => {
  try {
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

studioRouter.put('/users/:id/role', requireRole(['super_admin']), async (req: Request, res: Response) => {
  const id = getParam(req, 'id');
  const { roleId } = req.body;
  if (!roleId) return res.status(400).json({ error: 'InvalidRole', message: 'roleId is required' });
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
studioRouter.get('/settings', (req: Request, res: Response) => {
  const settings = repository.getSiteSettings();
  return res.json(settings);
});

studioRouter.put('/settings', requireRole(['super_admin', 'admin']), async (req: Request, res: Response) => {
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
studioRouter.get('/audit', requireRole(['super_admin', 'admin']), (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string || '100', 10);
  const logs = AuditService.getRecentLogs(limit);
  return res.json({ total: logs.length, logs });
});
