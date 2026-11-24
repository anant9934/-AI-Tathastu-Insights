import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { subscribers } from '#lib/server/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return { success: false, error: 'No confirmation token provided.' };
	}

	const now = new Date();

	const sub = await db.query.subscribers.findFirst({
		where: and(
			eq(subscribers.confirmToken, token),
			gt(subscribers.confirmTokenExpiresAt, now)
		)
	});

	if (!sub) {
		return {
			success: false,
			error: 'This confirmation link has expired or has already been used. Please subscribe again to receive a new link.'
		};
	}

	// Consume token & confirm subscription
	await db
		.update(subscribers)
		.set({
			status: 'confirmed',
			confirmedAt: now,
			confirmToken: null,
			confirmTokenExpiresAt: null
		})
		.where(eq(subscribers.id, sub.id));

	return {
		success: true,
		email: sub.email
	};
};
