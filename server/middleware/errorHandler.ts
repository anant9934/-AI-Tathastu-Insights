import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/auditService';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  AuditService.log({
    userId: req.user?.id || null,
    action: 'system:error',
    resourceType: 'api',
    details: {
      status,
      message,
      path: req.path,
      method: req.method,
    },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[API ERROR] ${req.method} ${req.path}:`, err);
  }

  return res.status(status).json({
    error: err.name || 'ServerError',
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
