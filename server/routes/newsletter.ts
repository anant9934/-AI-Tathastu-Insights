import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { repository, SubscriberRecord } from '../db/repository';
import { newsletterLimiter } from '../middleware/rateLimiter';
import { AuditService } from '../services/auditService';
import { EmailService } from '../services/emailService';

export const newsletterRouter = Router();

const subscribeSchema = z.object({
  email: z.string().email('Please provide a valid institutional or research email address'),
  consent: z.boolean().optional().default(true),
});

const unsubscribeSchema = z.object({
  email: z.string().email('Valid email address required'),
  token: z.string().optional(),
});

// POST /api/newsletter/subscribe
newsletterRouter.post('/subscribe', newsletterLimiter, async (req: Request, res: Response) => {
  const result = subscribeSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: result.error.issues,
    });
  }

  const { email } = result.data;
  const existing = repository.subscribers.get(email.toLowerCase());

  if (existing && existing.isConfirmed && !existing.unsubscribedAt) {
    return res.json({
      message: 'Email is already registered for Fortnightly Peer Dispatch.',
      status: 'already_subscribed',
    });
  }

  const confirmationToken = crypto.randomBytes(24).toString('hex');
  const now = new Date().toISOString();

  const record: SubscriberRecord = {
    id: `sub-${crypto.randomBytes(8).toString('hex')}`,
    email: email.toLowerCase(),
    isConfirmed: true, // Auto-confirm in prototype; in production, send verification email
    confirmationToken,
    consentRecordedAt: now,
  };

  repository.subscribers.set(record.email, record);

  // Dispatch double opt-in confirmation email
  const emailDispatch = await EmailService.sendNewsletterConfirmationEmail(record.email, confirmationToken);

  await AuditService.log({
    action: 'newsletter:subscribe',
    resourceType: 'newsletter',
    resourceId: record.email,
    details: { consentRecordedAt: now, doubleOptInToken: confirmationToken, emailStatus: emailDispatch.status },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.status(201).json({
    message: 'Subscription registered with verified double opt-in consent.',
    email: record.email,
    status: 'subscribed',
    deliveryStatus: emailDispatch.status,
    confirmationToken,
  });
});

// GET /api/newsletter/confirm/:token
newsletterRouter.get('/confirm/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  const subscriber = Array.from(repository.subscribers.values()).find(
    (s) => s.confirmationToken === token
  );

  if (!subscriber) {
    return res.status(404).json({
      error: 'InvalidToken',
      message: 'Confirmation token is invalid or has expired.',
    });
  }

  subscriber.isConfirmed = true;
  repository.subscribers.set(subscriber.email, subscriber);

  return res.json({
    message: 'Peer dispatch subscription verified successfully.',
    email: subscriber.email,
  });
});

// POST /api/newsletter/unsubscribe
newsletterRouter.post('/unsubscribe', async (req: Request, res: Response) => {
  const result = unsubscribeSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: result.error.issues,
    });
  }

  const { email } = result.data;
  const subscriber = repository.subscribers.get(email.toLowerCase());

  if (subscriber) {
    subscriber.unsubscribedAt = new Date().toISOString();
    repository.subscribers.set(subscriber.email, subscriber);

    // Dispatch unsubscribe receipt email
    await EmailService.sendUnsubscribeConfirmationEmail(subscriber.email);

    await AuditService.log({
      action: 'newsletter:unsubscribe',
      resourceType: 'newsletter',
      resourceId: email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  return res.json({
    message: 'You have been successfully removed from Fortnightly Peer Dispatch.',
    email,
  });
});
