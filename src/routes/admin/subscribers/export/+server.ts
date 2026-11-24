import type { RequestHandler } from './$types';
import { db } from '#lib/server/db';
import { subscribers } from '#lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireRole } from '#lib/server/auth';
import { logAudit } from '#lib/server/audit';

export const GET: RequestHandler = async (event) => {
	const user = requireRole(event.locals.user, ['editor', 'owner']);
	const statusFilter = event.url.searchParams.get('status') || 'confirmed';

	const list = await db.query.subscribers.findMany({
		where: statusFilter !== 'all' ? eq(subscribers.status, statusFilter as any) : undefined,
		orderBy: [desc(subscribers.createdAt)]
	});

	// Audit export event (BR-NEWS-06.2)
	await logAudit({
		actorId: user.id,
		action: 'subscribers.export_csv',
		entityType: 'subscribers',
		diff: { count: list.length, statusFilter },
		event
	});

	const header = 'email,status,source,confirmed_at,created_at\r\n';
	const rows = list
		.map((s) => {
			const email = `"${s.email.replace(/"/g, '""')}"`;
			const status = `"${s.status}"`;
			const source = `"${s.source}"`;
			const confirmedAt = s.confirmedAt ? `"${new Date(s.confirmedAt).toISOString()}"` : '""';
			const createdAt = `"${new Date(s.createdAt).toISOString()}"`;
			return `${email},${status},${source},${confirmedAt},${createdAt}`;
		})
		.join('\r\n');

	const csvContent = header + rows;

	return new Response(csvContent, {
		status: 200,
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="subscribers_${statusFilter}_${new Date().toISOString().slice(0, 10)}.csv"`,
			'Cache-Control': 'no-store'
		}
	});
};
