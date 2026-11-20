import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { repository } from '../db/repository';

const JWT_SECRET = process.env.JWT_SECRET || 'tathastu-frontier-insights-secure-jwt-key-2026';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roleId: 'super_admin' | 'admin' | 'editor' | 'research_editor' | 'author' | 'media_manager' | 'contributor';
  affiliation?: string;
  jti?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      sessionId?: string;
      tokenHash?: string;
    }
  }
}

export class AuthService {
  public static signToken(user: AuthUser, expiresIn = '7d'): string {
    const jti = user.jti || crypto.randomBytes(16).toString('hex');
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
        affiliation: user.affiliation,
        jti,
      },
      JWT_SECRET,
      { expiresIn: expiresIn as any }
    );
  }

  public static verifyToken(token: string): AuthUser {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  }

  public static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  public static extractToken(req: Request): string | null {
    // 1. Check Authorization Bearer header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    // 2. Check httpOnly Cookie header
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const match = cookieHeader.match(/tathastu_studio_token=([^;]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    }

    return null;
  }
}

/**
 * Required authentication middleware with session validation and revocation enforcement
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = AuthService.extractToken(req);
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token required to access this resource.',
    });
  }

  // Check token revocation blacklist
  const tokenHash = AuthService.hashToken(token);
  if (repository.isTokenRevoked(tokenHash)) {
    return res.status(401).json({
      error: 'TokenRevoked',
      message: 'This session has been logged out or revoked. Please sign in again.',
    });
  }

  try {
    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    req.tokenHash = tokenHash;
    next();
  } catch (err: any) {
    return res.status(401).json({
      error: 'InvalidToken',
      message: err.name === 'TokenExpiredError' ? 'Session expired. Please sign in again.' : 'Supplied authentication token is invalid.',
    });
  }
};

/**
 * Optional authentication middleware for guest session tracking
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const sessionHeader = req.headers['x-session-id'] as string;
  if (sessionHeader) {
    req.sessionId = sessionHeader;
  }

  const token = AuthService.extractToken(req);
  if (token) {
    const tokenHash = AuthService.hashToken(token);
    if (!repository.isTokenRevoked(tokenHash)) {
      try {
        req.user = AuthService.verifyToken(token);
        req.tokenHash = tokenHash;
      } catch {
        // Ignore invalid token in optional context
      }
    }
  }

  next();
};
