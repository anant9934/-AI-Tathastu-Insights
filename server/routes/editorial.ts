import { Router, Request, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { repository, ManuscriptRecord, EditorialReviewRecord } from '../db/repository';
import { requireAuth } from '../middleware/auth';
import { requireRole, requireEditorialAccess } from '../middleware/rbac';
import { submissionLimiter } from '../middleware/rateLimiter';
import { StorageService } from '../services/storageService';
import { AuditService } from '../services/auditService';
import fs from 'fs';

export const editorialRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

const submitManuscriptSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  authorName: z.string().min(2, 'Author name must be at least 2 characters'),
  authorEmail: z.string().email('Valid institutional email required'),
  authorAffiliation: z.string().min(2, 'Affiliation is required'),
  categoryId: z.string().min(1, 'Category must be selected'),
  abstract: z.string().min(50, 'Abstract must be at least 50 characters for double-blind audit'),
  wordCount: z.number().int().positive().optional().default(4200),
  reproducibilityAttestation: z.boolean().refine((val) => val === true, {
    message: 'You must attest to empirical reproducibility.',
  }),
});

const updateStatusSchema = z.object({
  status: z.enum([
    'draft',
    'submitted',
    'in_review',
    'revision_requested',
    'approved',
    'scheduled',
    'published',
    'rejected',
    'archived',
  ]),
  notes: z.string().optional(),
});

const submitReviewSchema = z.object({
  stage: z.enum(['initial_screening', 'peer_review', 'ethics_check', 'editorial_decision']),
  score: z.number().min(1.0).max(10.0),
  recommendation: z.enum(['accept', 'minor_revisions', 'major_revisions', 'reject']),
  commentsForAuthor: z.string().min(20, 'Constructive feedback required for author'),
  confidentialComments: z.string().optional(),
});

// GET /api/editorial/submissions - List submissions
editorialRouter.get('/submissions', (req: Request, res: Response) => {
  const statusFilter = req.query.status as string;
  const categoryFilter = req.query.category as string;
  const search = (req.query.q as string || '').toLowerCase().trim();

  let list = Array.from(repository.manuscripts.values());

  if (statusFilter && statusFilter !== 'all') {
    list = list.filter((m) => m.status === statusFilter);
  }

  if (categoryFilter && categoryFilter !== 'all') {
    list = list.filter((m) => m.categoryId.toLowerCase().includes(categoryFilter.toLowerCase()));
  }

  if (search) {
    list = list.filter(
      (m) =>
        m.title.toLowerCase().includes(search) ||
        m.authorName.toLowerCase().includes(search) ||
        m.id.toLowerCase().includes(search)
    );
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return res.json({
    total: list.length,
    submissions: list,
  });
});

// POST /api/editorial/submissions - Deposit new manuscript
editorialRouter.post('/submissions', submissionLimiter, async (req: Request, res: Response) => {
  const result = submitManuscriptSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: result.error.issues,
    });
  }

  const data = result.data;
  const year = new Date().getFullYear();
  const randomSeq = Math.floor(100 + Math.random() * 900);
  const id = `sub-${year}-${randomSeq}`;
  const now = new Date().toISOString().split('T')[0];

  const newManuscript: ManuscriptRecord = {
    id,
    title: data.title,
    authorName: data.authorName,
    authorEmail: data.authorEmail,
    authorAffiliation: data.authorAffiliation,
    categoryId: data.categoryId,
    abstract: data.abstract,
    wordCount: data.wordCount,
    status: 'submitted',
    assignedEditorId: 'usr-editor-01',
    assignedEditorName: 'Prof. Clara Zheng',
    reproducibilityAttestation: true,
    submittedAt: now,
    updatedAt: now,
  };

  repository.manuscripts.set(id, newManuscript);

  await AuditService.log({
    userId: req.user?.id || null,
    action: 'editorial:manuscript_submitted',
    resourceType: 'manuscript',
    resourceId: id,
    details: { title: data.title, author: data.authorName, category: data.categoryId },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.status(201).json({
    message: 'Manuscript deposited successfully into double-blind review queue.',
    submission: newManuscript,
  });
});

// PATCH /api/editorial/submissions/:id/status - Update manuscript workflow status
editorialRouter.patch('/submissions/:id/status', requireAuth, requireEditorialAccess, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = updateStatusSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: result.error.issues,
    });
  }

  const manuscript = repository.manuscripts.get(id);
  if (!manuscript) {
    return res.status(404).json({
      error: 'NotFound',
      message: `Manuscript ${id} does not exist.`,
    });
  }

  const oldStatus = manuscript.status;
  const newStatus = result.data.status;

  // Validate state transitions
  const validTransitions: Record<string, string[]> = {
    draft: ['submitted', 'archived'],
    submitted: ['in_review', 'rejected', 'archived'],
    in_review: ['revision_requested', 'approved', 'rejected'],
    revision_requested: ['in_review', 'rejected', 'archived'],
    approved: ['scheduled', 'published', 'archived'],
    scheduled: ['published', 'archived'],
    published: ['archived'],
    rejected: ['archived'],
    archived: ['draft'],
  };

  // Allow super_admin override, otherwise enforce lifecycle invariants
  if (req.user?.roleId !== 'super_admin' && !validTransitions[oldStatus]?.includes(newStatus)) {
    return res.status(400).json({
      error: 'InvalidTransition',
      message: `Cannot transition from '${oldStatus}' to '${newStatus}'. Allowed: ${validTransitions[oldStatus]?.join(', ') || 'none'}.`,
    });
  }

  manuscript.status = newStatus;
  manuscript.updatedAt = new Date().toISOString().split('T')[0];
  repository.manuscripts.set(id, manuscript);

  await AuditService.log({
    userId: req.user!.id,
    action: 'editorial:status_updated',
    resourceType: 'manuscript',
    resourceId: id,
    details: {
      from: oldStatus,
      to: newStatus,
      notes: result.data.notes,
      editor: req.user!.name,
    },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.json({
    message: `Manuscript ${id} status updated to ${newStatus}.`,
    submission: manuscript,
  });
});

// POST /api/editorial/submissions/:id/review - Record peer review
editorialRouter.post('/submissions/:id/review', requireAuth, requireEditorialAccess, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = submitReviewSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: result.error.issues,
    });
  }

  const manuscript = repository.manuscripts.get(id);
  if (!manuscript) {
    return res.status(404).json({
      error: 'NotFound',
      message: `Manuscript ${id} does not exist.`,
    });
  }

  const review: EditorialReviewRecord = {
    id: `rev-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    submissionId: id,
    reviewerId: req.user!.id,
    reviewerName: req.user!.name,
    stage: result.data.stage,
    score: result.data.score,
    recommendation: result.data.recommendation,
    commentsForAuthor: result.data.commentsForAuthor,
    confidentialComments: result.data.confidentialComments,
    submittedAt: new Date().toISOString(),
  };

  repository.reviews.set(review.id, review);
  manuscript.reviewerScore = result.data.score;
  repository.manuscripts.set(id, manuscript);

  await AuditService.log({
    userId: req.user!.id,
    action: 'editorial:review_submitted',
    resourceType: 'editorial_review',
    resourceId: review.id,
    details: {
      submissionId: id,
      score: review.score,
      recommendation: review.recommendation,
    },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.status(201).json({
    message: 'Peer review recorded successfully.',
    review,
  });
});

// POST /api/editorial/upload - Secure file upload
editorialRouter.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'No file uploaded.',
    });
  }

  try {
    const uploadResult = await StorageService.saveUploadedFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    await AuditService.log({
      userId: req.user?.id || null,
      action: 'editorial:file_uploaded',
      resourceType: 'file',
      details: {
        filename: uploadResult.originalName,
        sizeBytes: uploadResult.sizeBytes,
        hashSha256: uploadResult.hashSha256,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(201).json({
      message: 'File uploaded and validated successfully.',
      ...uploadResult,
    });
  } catch (err: any) {
    return res.status(400).json({
      error: 'UploadError',
      message: err.message,
    });
  }
});

// GET /api/editorial/manuscripts/files/:filename - Download uploaded manuscript file
editorialRouter.get('/manuscripts/files/:filename', (req: Request, res: Response) => {
  const filePath = StorageService.getFilePath(req.params.filename as string);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      error: 'NotFound',
      message: 'Requested manuscript file does not exist.',
    });
  }

  return res.download(filePath);
});
