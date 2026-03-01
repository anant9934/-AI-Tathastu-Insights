import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { generalApiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { editorialRouter } from './routes/editorial';
import { researchRouter } from './routes/research';
import { bookmarksRouter } from './routes/bookmarks';
import { newsletterRouter } from './routes/newsletter';
import { mediaRouter } from './routes/media';
import { searchRouter } from './routes/search';
import { requireAuth } from './middleware/auth';
import { requireRole } from './middleware/rbac';
import { AuditService } from './services/auditService';
import { getDatabase } from './db';

export function createApp(): Express {
  const app = express();

  // 1. Security & Hygiene Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Managed by Vite in dev / Vercel in prod
    crossOriginEmbedderPolicy: false,
  }));
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 2. Global Rate Limiting
  app.use('/api', generalApiLimiter);

  // 3. Mount Domain Routers
  app.use('/api/auth', authRouter);
  app.use('/api/editorial', editorialRouter);
  app.use('/api/research', researchRouter);
  app.use('/api/bookmarks', bookmarksRouter);
  app.use('/api/newsletter', newsletterRouter);
  app.use('/api/media', mediaRouter);
  app.use('/api/search', searchRouter);

  // 4. System Health & Diagnostic Status Endpoint
  app.get('/api/system/health', (req: Request, res: Response) => {
    const dbStatus = getDatabase();
    return res.json({
      status: 'operational',
      environment: process.env.NODE_ENV || 'development',
      version: '4.2.0-insights-production',
      database: {
        isLive: dbStatus.isLive,
        type: dbStatus.type,
      },
      security: {
        rbacEnforced: true,
        rateLimitingActive: true,
        doiVerificationEnforced: true,
        auditLoggingEnabled: true,
      },
      timestamp: new Date().toISOString(),
    });
  });

  // 5. System Audit Trail (Super Admin only)
  app.get('/api/system/audit', requireAuth, requireRole(['super_admin']), (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string || '50', 10);
    const logs = AuditService.getRecentLogs(limit);
    return res.json({
      total: logs.length,
      logs,
    });
  });

  // 6. Centralized Error Handler
  app.use(errorHandler);

  return app;
}
