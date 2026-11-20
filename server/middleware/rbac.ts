import { Request, Response, NextFunction } from 'express';
import { AuthUser } from './auth';

// Role hierarchy levels
const ROLE_HIERARCHY: Record<AuthUser['roleId'], number> = {
  super_admin: 100,
  admin: 90,
  editor: 80,
  research_editor: 60,
  media_manager: 50,
  author: 40,
  contributor: 20,
};

/**
 * Enforce minimum role or explicit role membership
 */
export const requireRole = (allowedRoles: Array<AuthUser['roleId']>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.roleId) && req.user.roleId !== 'super_admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Action requires one of the following roles: ${allowedRoles.join(', ')}. Current role: ${req.user.roleId}`,
      });
    }

    next();
  };
};

/**
 * Editorial permission check
 */
export const requireEditorialAccess = (req: Request, res: Response, next: NextFunction) => {
  return requireRole(['super_admin', 'editor', 'research_editor'])(req, res, next);
};
