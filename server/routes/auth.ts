import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
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

  const salt = bcrypt.genSaltSync(10);
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

  const token = AuthService.signToken({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    roleId: newUser.roleId,
    affiliation: newUser.affiliation,
  });

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

// GET /api/auth/me
authRouter.get('/me', requireAuth, (req: Request, res: Response) => {
  return res.json({
    user: req.user,
  });
});
