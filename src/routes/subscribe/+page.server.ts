import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { subscribers } from '#lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sendSubscriberConfirmationEmail } from '#lib/server/email';
import { generateToken } from '#lib/server/auth';
import { checkRateLimit } from '#lib/server/rate-limit';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const clientIp = event.getClientAddress?.() || event.request.headers.get('x-forwarded-for') || '127.0.0.1';

		// 1. Honeypot check (BR-NEWS-01.3: silently discard bot submissions)
		const honeypot = formData.get('b_url_honeypot')?.toString();
		if (honeypot && honeypot.length > 0) {
			return {
				success: true,
				message: 'Thank you! Please check your inbox to confirm your subscription.'
			};
		}

		// 2. Rate limit: 3 requests / hour / IP (BR-NEWS-01.4)
		const limit = checkRateLimit({
			key: `subscribe:${clientIp}`,
			limit: 3,
			windowMs: 60 * 60 * 1000
		});

		if (!limit.success) {
			return fail(429, {
				error: 'Too many subscription attempts from your IP. Please try again later.'
			});
		}

		const rawEmail = (formData.get('email')?.toString() || '').trim();
		// Normalized email (BR-NEWS-01.5)
		const email = rawEmail.toLowerCase();

		if (!email || !email.includes('@') || email.length < 5) {
			return fail(400, {
				error: 'Please provide a valid email address.'
			});
		}

		const origin = event.url.origin;

		try {
			const existing = await db.query.subscribers.findFirst({
				where: eq(subscribers.email, email)
			});

			if (!existing) {
				// New subscriber: create with pending status and 7-day token (FR-NEWS-02)
				const confirmToken = generateToken(32);
				const unsubscribeToken = generateToken(32);
				const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

				await db.insert(subscribers).values({
					email,
					status: 'pending',
					source: 'website',
					confirmToken,
					confirmTokenExpiresAt: expiresAt,
					unsubscribeToken
				});

				const confirmUrl = `${origin}/confirm?token=${confirmToken}`;
				await sendSubscriberConfirmationEmail({ to: email, confirmUrl });
			} else if (existing.status === 'pending') {
				// Pending subscriber signs up again: rotate confirmation token, resend (BR-NEWS-02.3)
				const newConfirmToken = generateToken(32);
				const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

				await db
					.update(subscribers)
					.set({
						confirmToken: newConfirmToken,
						confirmTokenExpiresAt: expiresAt
					})
					.where(eq(subscribers.id, existing.id));

				const confirmUrl = `${origin}/confirm?token=${newConfirmToken}`;
				await sendSubscriberConfirmationEmail({ to: email, confirmUrl });
			} else {
				// Already confirmed or unsubscribed: anti-enumeration (FR-NEWS-04, BR-NEWS-01.2)
				// Artificial delay to normalize response timing
				await new Promise((resolve) => setTimeout(resolve, 300));
			}
		} catch (err) {
			console.error('[Subscription Error]', err);
		}

		// Always return identical generic message (anti-enumeration BR-NEWS-01.2)
		return {
			success: true,
			message: 'Thank you! If this is a new subscription, we have sent a confirmation email to verify your address. Please check your inbox.'
		};
	}
};
