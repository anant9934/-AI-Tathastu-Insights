import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { subscribers } from '#lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { requireRole } from '#lib/server/auth';
import { logAudit } from '#lib/server/audit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = requireRole(locals.user, ['editor', 'owner']);
	const statusFilter = url.searchParams.get('status') || 'all';

	const allSubs = await db.query.subscribers.findMany({
		where: statusFilter !== 'all' ? eq(subscribers.status, statusFilter as any) : undefined,
		orderBy: [desc(subscribers.createdAt)]
	});

	const counts = {
		total: allSubs.length,
		confirmed: allSubs.filter((s) => s.status === 'confirmed').length,
		pending: allSubs.filter((s) => s.status === 'pending').length,
		unsubscribed: allSubs.filter((s) => s.status === 'unsubscribed').length
	};

	return {
		subscribers: allSubs,
		counts,
		statusFilter,
		currentUser: user
	};
};

export const actions: Actions = {
	delete: async (event) => {
		const user = requireRole(event.locals.user, ['owner']);
		const formData = await event.request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID required' });

		await db.delete(subscribers).where(eq(subscribers.id, id));

		await logAudit({
			actorId: user.id,
			action: 'subscriber.delete_gdpr',
			entityType: 'subscriber',
			entityId: id,
			event
		});

		return { success: true };
	}
};
