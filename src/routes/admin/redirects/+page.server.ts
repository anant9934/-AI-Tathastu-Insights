import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { redirects } from '#lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { requireRole } from '#lib/server/auth';
import { logAudit } from '#lib/server/audit';

export const load: PageServerLoad = async ({ locals }) => {
	requireRole(locals.user, ['editor', 'owner']);

	const allRedirects = await db.query.redirects.findMany({
		orderBy: [desc(redirects.createdAt)]
	});

	return {
		redirects: allRedirects
	};
};

export const actions: Actions = {
	create: async (event) => {
		const user = requireRole(event.locals.user, ['editor', 'owner']);
		const formData = await event.request.formData();
		let fromPath = (formData.get('fromPath')?.toString() || '').trim();
		let toPath = (formData.get('toPath')?.toString() || '').trim();

		if (!fromPath.startsWith('/')) fromPath = `/${fromPath}`;
		if (!toPath.startsWith('/')) toPath = `/${toPath}`;

		if (fromPath === toPath) {
			return fail(400, { error: 'Source and target path cannot be identical (loop prevention).' });
		}

		await db
			.insert(redirects)
			.values({
				fromPath,
				toPath,
				status: 301
			})
			.onConflictDoUpdate({
				target: redirects.fromPath,
				set: { toPath, status: 301 }
			});

		await logAudit({
			actorId: user.id,
			action: 'redirect.create',
			entityType: 'redirect',
			entityId: fromPath,
			diff: { fromPath, toPath },
			event
		});

		return { success: true };
	},

	delete: async (event) => {
		const user = requireRole(event.locals.user, ['editor', 'owner']);
		const formData = await event.request.formData();
		const fromPath = formData.get('fromPath')?.toString();

		if (!fromPath) return fail(400, { error: 'fromPath required' });

		await db.delete(redirects).where(eq(redirects.fromPath, fromPath));

		await logAudit({
			actorId: user.id,
			action: 'redirect.delete',
			entityType: 'redirect',
			entityId: fromPath,
			event
		});

		return { success: true };
	}
};
