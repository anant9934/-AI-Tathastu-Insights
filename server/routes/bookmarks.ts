import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { repository, BookmarkRecord } from '../db/repository';
import { optionalAuth, requireAuth } from '../middleware/auth';
import { AuditService } from '../services/auditService';

export const bookmarksRouter = Router();

const toggleBookmarkSchema = z.object({
  articleId: z.string().min(1, 'Article ID required'),
});

const syncBookmarksSchema = z.object({
  sessionId: z.string().min(1, 'Guest session ID required to sync'),
  articleIds: z.array(z.string()).optional(),
});

// GET /api/bookmarks - Get bookmarks for current user or guest session
bookmarksRouter.get('/', optionalAuth, (req: Request, res: Response) => {
  const userId = req.user?.id;
  const sessionId = req.sessionId || req.headers['x-session-id'] as string;

  const userBookmarks = Array.from(repository.bookmarks.values()).filter((b) => {
    if (userId) return b.userId === userId;
    if (sessionId) return b.sessionId === sessionId;
    return false;
  });

  return res.json({
    total: userBookmarks.length,
    bookmarkedIds: userBookmarks.map((b) => b.articleId),
  });
});

// POST /api/bookmarks/toggle - Toggle bookmark status
bookmarksRouter.post('/toggle', optionalAuth, async (req: Request, res: Response) => {
  const result = toggleBookmarkSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: result.error.issues,
    });
  }

  const { articleId } = result.data;
  const userId = req.user?.id;
  const sessionId = req.sessionId || req.headers['x-session-id'] as string || 'guest-session-default';

  // Find existing bookmark
  const existing = Array.from(repository.bookmarks.values()).find((b) => {
    if (userId) return b.userId === userId && b.articleId === articleId;
    return b.sessionId === sessionId && b.articleId === articleId;
  });

  if (existing) {
    repository.bookmarks.delete(existing.id);
    await AuditService.log({
      userId: userId || null,
      action: 'bookmark:removed',
      resourceType: 'bookmark',
      resourceId: articleId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.json({
      bookmarked: false,
      articleId,
      message: 'Bookmark removed.',
    });
  }

  const newBookmark: BookmarkRecord = {
    id: `bm-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    userId,
    sessionId: userId ? undefined : sessionId,
    articleId,
    createdAt: new Date().toISOString(),
  };

  repository.bookmarks.set(newBookmark.id, newBookmark);

  await AuditService.log({
    userId: userId || null,
    action: 'bookmark:created',
    resourceType: 'bookmark',
    resourceId: articleId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.status(201).json({
    bookmarked: true,
    articleId,
    message: 'Article bookmarked successfully.',
  });
});

// POST /api/bookmarks/sync - Synchronize guest bookmarks to authenticated user profile upon login
bookmarksRouter.post('/sync', requireAuth, async (req: Request, res: Response) => {
  const result = syncBookmarksSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: result.error.issues,
    });
  }

  const userId = req.user!.id;
  const { sessionId, articleIds = [] } = result.data;

  // Find guest bookmarks
  const guestBookmarks = Array.from(repository.bookmarks.values()).filter(
    (b) => b.sessionId === sessionId
  );

  const allToSync = new Set([
    ...guestBookmarks.map((b) => b.articleId),
    ...articleIds,
  ]);

  for (const articleId of allToSync) {
    const alreadySaved = Array.from(repository.bookmarks.values()).some(
      (b) => b.userId === userId && b.articleId === articleId
    );

    if (!alreadySaved) {
      const synced: BookmarkRecord = {
        id: `bm-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        userId,
        articleId,
        createdAt: new Date().toISOString(),
      };
      repository.bookmarks.set(synced.id, synced);
    }
  }

  // Remove guest session bookmarks after transferring
  for (const gb of guestBookmarks) {
    repository.bookmarks.delete(gb.id);
  }

  await AuditService.log({
    userId,
    action: 'bookmark:synchronized',
    resourceType: 'bookmark',
    details: { count: allToSync.size, fromSession: sessionId },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  const finalUserBookmarks = Array.from(repository.bookmarks.values())
    .filter((b) => b.userId === userId)
    .map((b) => b.articleId);

  return res.json({
    message: 'Bookmarks synchronized successfully.',
    bookmarkedIds: finalUserBookmarks,
  });
});
