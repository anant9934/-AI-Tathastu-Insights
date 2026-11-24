import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { users } from '#lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { createMagicLinkToken } from '#lib/server/auth';
import { sendMagicLinkEmail } from '#lib/server/email';
import { checkRateLimit } from '#lib/server/rate-limit';
import { logAudit } from '#lib/server/audit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/admin');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = (formData.get('email')?.toString() || '').trim().toLowerCase();
		const clientIp = event.getClientAddress?.() || event.request.headers.get('x-forwarded-for') || '127.0.0.1';

		if (!email || !email.includes('@')) {
			return fail(400, { error: 'Please enter a valid email address.', email });
		}

		// Rate limiting: <= 5 requests per 15 min per IP and per email (BR-AUTH-07.1)
		const ipLimit = checkRateLimit({
			key: `magic_link_ip:${clientIp}`,
			limit: 5,
			windowMs: 15 * 60 * 1000
		});
		const emailLimit = checkRateLimit({
			key: `magic_link_email:${email}`,
			limit: 5,
			windowMs: 15 * 60 * 1000
		});

		if (!ipLimit.success || !emailLimit.success) {
			return fail(429, {
				error: 'Too many sign-in attempts. Please try again in 15 minutes.'
			});
		}

		// Check if user exists and is active
		try {
			const existingUser = await db.query.users.findFirst({
				where: and(eq(users.email, email), eq(users.deactivated, false))
			});

			if (existingUser) {
				const token = await createMagicLinkToken(existingUser.id);
				const origin = event.url.origin;
				const magicLinkUrl = `${origin}/admin/auth?token=${token}`;

				await sendMagicLinkEmail({
					to: existingUser.email,
					magicLinkUrl,
					userName: existingUser.name
				});

				if (process.env.NODE_ENV === 'development') {
					console.log('🔗 [DEV MAGIC LINK FOR LOGIN]:', magicLinkUrl);
				}

				await logAudit({
					actorId: existingUser.id,
					action: 'auth.magic_link_requested',
					entityType: 'user',
					entityId: existingUser.id,
					event
				});
			} else {
				// Anti-enumeration: do not leak existence (BR-AUTH-01.4)
				// Artificial delay to normalize timing
				await new Promise((resolve) => setTimeout(resolve, 400));
			}
		} catch (err) {
			console.error('[Auth] Magic link error:', err);
		}

		// Always return identical generic success message (FR-AUTH-01 Main flow step 3)
		return {
			success: true,
			message: 'If an account exists for this email, a sign-in link has been sent. Check your inbox.'
		};
	}
};
