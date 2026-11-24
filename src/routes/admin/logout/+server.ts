import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { invalidateSession, clearSessionCookie, SESSION_COOKIE_NAME } from '#lib/server/auth';
import { logAudit } from '#lib/server/audit';

export const POST: RequestHandler = async (event) => {
	const sessionCookie = event.cookies.get(SESSION_COOKIE_NAME);
	if (sessionCookie) {
		await invalidateSession(sessionCookie);
		clearSessionCookie(event);

		if (event.locals.user) {
			await logAudit({
				actorId: event.locals.user.id,
				action: 'auth.logout',
				entityType: 'user',
				entityId: event.locals.user.id,
				event
			});
		}
	}

	throw redirect(303, '/admin/login');
};

export const GET: RequestHandler = async (event) => {
	const sessionCookie = event.cookies.get(SESSION_COOKIE_NAME);
	if (sessionCookie) {
		await invalidateSession(sessionCookie);
		clearSessionCookie(event);
	}
	throw redirect(303, '/admin/login');
};
