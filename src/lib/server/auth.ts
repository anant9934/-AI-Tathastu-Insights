import { db } from './db';
import { users, authTokens, sessions } from './db/schema';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'node:crypto';
import type { RequestEvent } from '@sveltejs/kit';

export type UserRole = 'viewer' | 'author' | 'editor' | 'owner';

export interface AuthUser {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	emailVerified: boolean;
	deactivated: boolean;
}

// SHA-256 hash helper
export function hashToken(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex');
}

// Generate a random secure url-safe token
export function generateToken(bytes = 32): string {
	return crypto.randomBytes(bytes).toString('hex');
}

// Create a magic link token for a user (expires in 15 minutes)
export async function createMagicLinkToken(userId: string): Promise<string> {
	const rawToken = generateToken(32);
	const tokenHash = hashToken(rawToken);
	const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

	await db.insert(authTokens).values({
		userId,
		tokenHash,
		expiresAt
	});

	return rawToken;
}

// Redeem magic link token (single-use, constant-time, invalidated on success)
export async function redeemMagicLinkToken(rawToken: string): Promise<AuthUser | null> {
	const tokenHash = hashToken(rawToken);
	const now = new Date();

	// Find active token
	const record = await db.query.authTokens.findFirst({
		where: and(
			eq(authTokens.tokenHash, tokenHash),
			gt(authTokens.expiresAt, now)
		),
		with: {
			user: true
		}
	});

	if (!record || record.usedAt) {
		return null;
	}

	// Mark token as used immediately
	await db
		.update(authTokens)
		.set({ usedAt: now })
		.where(eq(authTokens.id, record.id));

	// Verify user is active
	const user = await db.query.users.findFirst({
		where: and(eq(users.id, record.userId), eq(users.deactivated, false))
	});

	if (!user) {
		return null;
	}

	// Update user last login & verified
	await db
		.update(users)
		.set({
			lastLoginAt: now,
			emailVerified: true,
			updatedAt: now
		})
		.where(eq(users.id, user.id));

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role as UserRole,
		emailVerified: true,
		deactivated: user.deactivated
	};
}

// Session configuration
export const SESSION_COOKIE_NAME = 'auth_session';
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days sliding
export const ABSOLUTE_SESSION_MAX_MS = 30 * 24 * 60 * 60 * 1000; // 30 days absolute

export async function createSession(userId: string): Promise<string> {
	const rawSessionToken = generateToken(32);
	const sessionHash = hashToken(rawSessionToken);
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

	await db.insert(sessions).values({
		id: sessionHash,
		userId,
		expiresAt
	});

	return rawSessionToken;
}

export async function validateSession(rawSessionToken: string): Promise<AuthUser | null> {
	if (!rawSessionToken) return null;

	const sessionHash = hashToken(rawSessionToken);
	const now = new Date();

	const session = await db.query.sessions.findFirst({
		where: and(eq(sessions.id, sessionHash), gt(sessions.expiresAt, now))
	});

	if (!session) return null;

	// Check absolute max age
	const createdAt = new Date(session.createdAt).getTime();
	if (now.getTime() - createdAt > ABSOLUTE_SESSION_MAX_MS) {
		await db.delete(sessions).where(eq(sessions.id, sessionHash));
		return null;
	}

	// Slide expiry by 7 days
	const newExpiry = new Date(now.getTime() + SESSION_DURATION_MS);
	await db.update(sessions).set({ expiresAt: newExpiry }).where(eq(sessions.id, sessionHash));

	const user = await db.query.users.findFirst({
		where: and(eq(users.id, session.userId), eq(users.deactivated, false))
	});

	if (!user) return null;

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role as UserRole,
		emailVerified: user.emailVerified,
		deactivated: user.deactivated
	};
}

export async function invalidateSession(rawSessionToken: string): Promise<void> {
	const sessionHash = hashToken(rawSessionToken);
	await db.delete(sessions).where(eq(sessions.id, sessionHash));
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.userId, userId));
}

// RBAC Hierarchy & Guards
const ROLE_HIERARCHY: Record<UserRole, number> = {
	viewer: 1,
	author: 2,
	editor: 3,
	owner: 4
};

export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
	return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function isRoleAllowed(userRole: UserRole, allowedRoles: UserRole[]): boolean {
	return allowedRoles.includes(userRole);
}

// Server action & mutation guard (BR-AUTH-05.1)
export function requireRole(user: AuthUser | null | undefined, allowedRoles: UserRole[]): AuthUser {
	if (!user) {
		const err = new Error('Authentication required');
		(err as any).status = 401;
		throw err;
	}
	if (!isRoleAllowed(user.role, allowedRoles)) {
		const err = new Error('Forbidden: Insufficient privileges');
		(err as any).status = 403;
		throw err;
	}
	return user;
}

// Helper to set session cookie
export function setSessionCookie(event: RequestEvent, sessionToken: string) {
	event.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 7 * 24 * 60 * 60
	});
}

// Helper to clear session cookie
export function clearSessionCookie(event: RequestEvent) {
	event.cookies.delete(SESSION_COOKIE_NAME, {
		path: '/'
	});
}
