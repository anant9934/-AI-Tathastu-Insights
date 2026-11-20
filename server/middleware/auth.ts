import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tathastu-frontier-insights-secure-jwt-key-2026';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roleId: 'super_admin' | 'admin' | 'editor' | 'research_editor' | 'author' | 'media_manager' | 'contributor';
  affiliation?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      sessionId?: string;
    }
  }
}

export class AuthService {
  public static signToken(user: AuthUser, expiresIn = '7d'): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
        affiliation: user.affiliation,
      },
      JWT_SECRET,
      { expiresIn: expiresIn as any }
    );
  }

  public static verifyToken(token: string): AuthUser {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  }
}

/**
 * Required authentication middleware
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token required to access this resource.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'InvalidToken',
      message: 'Supplied authentication token is invalid or expired.',
    });
  }
};

/**
 * Optional authentication middleware for guest session tracking
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const sessionHeader = req.headers['x-session-id'] as string;

  if (sessionHeader) {
    req.sessionId = sessionHeader;
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = AuthService.verifyToken(token);
    } catch {
      // Ignore invalid token in optional context
    }
  }

  next();
};
