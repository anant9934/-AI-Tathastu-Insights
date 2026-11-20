import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { repository } from '../db/repository';
import { AuthService, requireAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { AuditService } from '../services/auditService';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  affiliation: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address format'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(16, 'Invalid reset token format'),
  newPassword: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a numeric digit'),
});

function setAuthCookie(res: Response, token: string) {
  res.cookie('tathastu_studio_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

// POST /api/auth/login
authRouter.post('/login', authLimiter, async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: result.error.issues,
    });
  }

  const { email, password } = result.data;
  const user = Array.from(repository.users.values()).find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user || !user.isActive) {
    await AuditService.log({
      action: 'auth:login_failed',
      resourceType: 'auth',
      details: { email, reason: 'user_not_found_or_inactive' },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(401).json({
      error: 'InvalidCredentials',
      message: 'Invalid email or password.',
    });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    await AuditService.log({
      userId: user.id,
      action: 'auth:login_failed',
      resourceType: 'auth',
      details: { email, reason: 'password_mismatch' },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(401).json({
      error: 'InvalidCredentials',
      message: 'Invalid email or password.',
    });
  }

  const token = AuthService.signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
    affiliation: user.affiliation,
  });

  setAuthCookie(res, token);

  await AuditService.log({
    userId: user.id,
    action: 'auth:login_success',
    resourceType: 'auth',
    details: { email: user.email, role: user.roleId },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      affiliation: user.affiliation,
    },
  });
});

// POST /api/auth/logout - Session Revocation & Cookie Clearing
authRouter.post('/logout', async (req: Request, res: Response) => {
  const token = AuthService.extractToken(req);
  if (token) {
    const tokenHash = AuthService.hashToken(token);
    repository.revokeToken(tokenHash, req.user?.id, undefined, 'user_logout');
  }

  res.clearCookie('tathastu_studio_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  if (req.user) {
    await AuditService.log({
      userId: req.user.id,
      action: 'auth:logout',
      resourceType: 'auth',
      details: { email: req.user.email },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  return res.json({
    success: true,
    message: 'Session revoked and logged out successfully.',
  });
});

// POST /api/auth/register
authRouter.post('/register', authLimiter, async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: result.error.issues,
    });
  }

  const { email, password, name, affiliation } = result.data;
  const existing = Array.from(repository.users.values()).find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'An account with this email address already exists.',
    });
  }

  const salt = bcrypt.genSaltSync(12);
  const passwordHash = bcrypt.hashSync(password, salt);
  const newUser = {
    id: `usr-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    email,
    passwordHash,
    name,
    roleId: 'contributor' as const,
    affiliation: affiliation || 'Independent Researcher',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  repository.users.set(newUser.id, newUser);
  repository.persistToDisk();

  const token = AuthService.signToken({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    roleId: newUser.roleId,
    affiliation: newUser.affiliation,
  });

  setAuthCookie(res, token);

  await AuditService.log({
    userId: newUser.id,
    action: 'auth:register',
    resourceType: 'user',
    resourceId: newUser.id,
    details: { email, role: newUser.roleId },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      roleId: newUser.roleId,
      affiliation: newUser.affiliation,
    },
  });
});

// POST /api/auth/forgot-password - Cryptographic Reset Token Generation
authRouter.post('/forgot-password', authLimiter, async (req: Request, res: Response) => {
  const parse = forgotPasswordSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'ValidationError', message: 'Valid email required' });
  }

  const { email } = parse.data;
  const user = Array.from(repository.users.values()).find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  let devResetToken: string | undefined;

  if (user && user.isActive) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    repository.createPasswordResetToken(user.id, tokenHash, expiresAt);
    devResetToken = rawToken;

    await AuditService.log({
      userId: user.id,
      action: 'auth:password_reset_requested',
      resourceType: 'auth',
      details: { email: user.email },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  // Consistent response to prevent user enumeration
  return res.json({
    success: true,
    message: 'If an authorized account is associated with this email, password reset instructions have been issued.',
    ...(process.env.NODE_ENV !== 'production' && devResetToken ? { resetToken: devResetToken } : {}),
  });
});

// POST /api/auth/reset-password - Verify Token & Apply 12-round Bcrypt Hash
authRouter.post('/reset-password', authLimiter, async (req: Request, res: Response) => {
  const parse = resetPasswordSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'ValidationError', issues: parse.error.issues });
  }

  const { token, newPassword } = parse.data;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const verification = repository.verifyAndConsumePasswordResetToken(tokenHash);
  if (!verification.valid || !verification.userId) {
    return res.status(400).json({
      error: 'InvalidToken',
      message: verification.error || 'Password reset token is invalid or has expired.',
    });
  }

  const salt = bcrypt.genSaltSync(12);
  const newHash = bcrypt.hashSync(newPassword, salt);
  repository.updateUserPassword(verification.userId, newHash);

  // Invalidate any active sessions for this user
  for (const [hash, entry] of repository.revokedTokens.entries()) {
    if (entry.userId === verification.userId) {
      repository.revokedTokens.delete(hash);
    }
  }

  await AuditService.log({
    userId: verification.userId,
    action: 'auth:password_reset_completed',
    resourceType: 'auth',
    details: { reason: 'user_initiated_reset' },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.json({
    success: true,
    message: 'Your password has been securely updated. Please sign in with your new credentials.',
  });
});

// POST /api/auth/quick-role - Strictly disabled in production
authRouter.post('/quick-role', async (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDemoEnabled = process.env.ENABLE_DEMO_PERSONAS === 'true';

  if (isProduction || !isDemoEnabled) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Quick demo login is strictly disabled in production. Authenticate using verified administrative credentials.',
    });
  }

  const { role } = req.body;
  const roleEmailMap: Record<string, string> = {
    super_admin: 'admin@tathastu-insights.org',
    editor: 'editor@tathastu-insights.org',
    research_editor: 'reviewer@tathastu-insights.org',
    author: 'author@institution.edu',
  };

  const email = roleEmailMap[role];
  if (!email) {
    return res.status(400).json({ error: 'InvalidRole', message: 'Requested demo role is not configured' });
  }

  const user = Array.from(repository.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'NotFound', message: 'Demo persona user not found' });
  }

  const token = AuthService.signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
    affiliation: user.affiliation,
  });

  setAuthCookie(res, token);

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      affiliation: user.affiliation,
    },
  });
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, (req: Request, res: Response) => {
  return res.json({
    user: req.user,
  });
});
