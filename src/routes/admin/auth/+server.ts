import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { redeemMagicLinkToken, createSession, setSessionCookie } from '#lib/server/auth';
import { checkRateLimit } from '#lib/server/rate-limit';
import { logAudit } from '#lib/server/audit';

export const GET: RequestHandler = async (event) => {
	const token = event.url.searchParams.get('token');
	const clientIp = event.getClientAddress?.() || event.request.headers.get('x-forwarded-for') || '127.0.0.1';

	// Rate limit token redemptions (BR-AUTH-07.2)
	const limit = checkRateLimit({
		key: `token_redeem_ip:${clientIp}`,
		limit: 10,
		windowMs: 15 * 60 * 1000
	});

	if (!limit.success) {
		throw redirect(303, '/admin/login?error=Too%20many%20attempts.%20Try%20again%20in%2015%20minutes.');
	}

	if (!token) {
		throw redirect(303, '/admin/login');
	}

	try {
		const user = await redeemMagicLinkToken(token);

		if (!user) {
			// Token either expired, already used, or invalid
			throw redirect(303, '/admin/login?error=This%20sign-in%20link%20has%20expired%20or%20already%20been%20used.%20Please%20request%20a%20new%20one.');
		}

		// Create session and set signed HTTP-only cookie
		const sessionToken = await createSession(user.id);
		setSessionCookie(event, sessionToken);

		await logAudit({
			actorId: user.id,
			action: 'auth.login_success',
			entityType: 'user',
			entityId: user.id,
			event
		});

		throw redirect(303, '/admin');
	} catch (err: any) {
		if (err?.status === 303) throw err;
		console.error('[Auth] Redemption error:', err);
		throw redirect(303, '/admin/login?error=Authentication%20failed.%20Please%20try%20again.');
	}
};
