import { db } from './db';
import { auditLog } from './db/schema';
import type { RequestEvent } from '@sveltejs/kit';

export interface AuditLogParams {
	actorId?: string | null;
	action: string;
	entityType: string;
	entityId?: string | null;
	diff?: Record<string, any> | null;
	event?: RequestEvent;
	ip?: string;
	userAgent?: string;
}

export async function logAudit({
	actorId,
	action,
	entityType,
	entityId,
	diff,
	event,
	ip,
	userAgent
}: AuditLogParams): Promise<void> {
	try {
		const clientIp = ip || (event ? event.getClientAddress?.() || event.request.headers.get('x-forwarded-for') : null);
		const clientUserAgent = userAgent || (event ? event.request.headers.get('user-agent') : null);

		await db.insert(auditLog).values({
			actorId: actorId || null,
			action,
			entityType,
			entityId: entityId || null,
			diff: diff || null,
			ip: clientIp,
			userAgent: clientUserAgent
		});
	} catch (err) {
		console.error('[Audit Log] Failed to write audit log entry:', err);
	}
}
