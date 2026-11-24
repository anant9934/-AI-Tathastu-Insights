import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { auditLog } from '#lib/server/db/schema';
import { desc } from 'drizzle-orm';
import { requireRole } from '#lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	requireRole(locals.user, ['owner']);

	const logs = await db.query.auditLog.findMany({
		orderBy: [desc(auditLog.createdAt)],
		limit: 100,
		with: {
			actor: {
				columns: { name: true, email: true, role: true }
			}
		}
	});

	return {
		logs
	};
};
