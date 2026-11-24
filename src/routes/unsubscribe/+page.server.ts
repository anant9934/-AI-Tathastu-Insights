import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { subscribers } from '#lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return {
			unsubscribed: false,
			error: 'Invalid unsubscribe link.'
		};
	}

	const sub = await db.query.subscribers.findFirst({
		where: eq(subscribers.unsubscribeToken, token)
	});

	if (!sub) {
		return {
			unsubscribed: false,
			error: 'Subscriber record not found or already removed.'
		};
	}

	// Immediate one-click unsubscribe without authentication (FR-NEWS-03)
	await db
		.update(subscribers)
		.set({
			status: 'unsubscribed'
		})
		.where(eq(subscribers.id, sub.id));

	return {
		unsubscribed: true,
		email: sub.email,
		token
	};
};

export const actions: Actions = {
	resubscribe: async (event) => {
		const formData = await event.request.formData();
		const token = formData.get('token')?.toString();

		if (!token) return fail(400, { error: 'Missing token' });

		const sub = await db.query.subscribers.findFirst({
			where: eq(subscribers.unsubscribeToken, token)
		});

		if (!sub) return fail(404, { error: 'Subscriber not found' });

		await db
			.update(subscribers)
			.set({
				status: 'confirmed'
			})
			.where(eq(subscribers.id, sub.id));

		return { resubscribed: true };
	}
};
