import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { settings } from '#lib/server/db/schema';
import { requireRole } from '#lib/server/auth';
import { logAudit } from '#lib/server/audit';

export const load: PageServerLoad = async ({ locals }) => {
	requireRole(locals.user, ['owner']);

	const allSettings = await db.query.settings.findMany();
	const config: Record<string, string> = {};
	for (const s of allSettings) {
		config[s.key] = s.value;
	}

	return {
		config
	};
};

export const actions: Actions = {
	default: async (event) => {
		const user = requireRole(event.locals.user, ['owner']);
		const formData = await event.request.formData();

		const keys = ['site_name', 'site_description', 'contact_email', 'archived_post_status', 'default_og_image'];
		for (const key of keys) {
			const val = formData.get(key)?.toString() || '';
			await db
				.insert(settings)
				.values({ key, value: val, updatedAt: new Date() })
				.onConflictDoUpdate({
					target: settings.key,
					set: { value: val, updatedAt: new Date() }
				});
		}

		await logAudit({
			actorId: user.id,
			action: 'settings.update',
			entityType: 'settings',
			event
		});

		return { success: true };
	}
};
