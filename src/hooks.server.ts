import type { Handle } from '@sveltejs/kit';
import { validateSession, SESSION_COOKIE_NAME } from '#lib/server/auth';
import { db } from '#lib/server/db';
import { redirects } from '#lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;

	// 1. Check for registered 301 redirects (FR-PUB-13)
	if (!pathname.startsWith('/api') && !pathname.startsWith('/admin') && !pathname.includes('.')) {
		try {
			const redirectEntry = await db.query.redirects.findFirst({
				where: eq(redirects.fromPath, pathname)
			});
			if (redirectEntry) {
				return new Response(null, {
					status: redirectEntry.status || 301,
					headers: { Location: redirectEntry.toPath }
				});
			}
		} catch (err) {
			// Fail open on redirect check errors
		}
	}

	// 2. Session validation
	const sessionCookie = event.cookies.get(SESSION_COOKIE_NAME);
	if (sessionCookie) {
		const user = await validateSession(sessionCookie);
		event.locals.user = user;
	} else {
		event.locals.user = null;
	}

	// 3. Admin route protection
	if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/auth')) {
		if (!event.locals.user) {
			return new Response(null, {
				status: 303,
				headers: { Location: `/admin/login?redirectTo=${encodeURIComponent(pathname)}` }
			});
		}
	}

	const response = await resolve(event);

	// 4. Security Headers (FR-SEC-01, FR-SEC-02, FR-SEC-03, FR-SEC-13)
	response.headers.set(
		'Content-Security-Policy',
		"default-src 'self'; img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com; media-src 'self' data: https://res.cloudinary.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
	);
	response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set('X-Frame-Options', 'DENY');

	// 5. Route-Specific Cache-Control (FR-SYS-01)
	if (pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/preview')) {
		response.headers.set('Cache-Control', 'private, no-store');
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	} else if (pathname === '/') {
		response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
	} else if (
		pathname === '/news' ||
		pathname === '/newsletter' ||
		pathname === '/ecosystem' ||
		pathname.startsWith('/category/')
	) {
		response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=86400');
	} else if (pathname === '/changelog') {
		response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
	} else if (pathname === '/rss.xml' || pathname === '/sitemap.xml') {
		response.headers.set('Cache-Control', 'public, s-maxage=3600');
	} else if (pathname === '/search') {
		response.headers.set('Cache-Control', 'public, s-maxage=60');
		response.headers.set('X-Robots-Tag', 'noindex');
	} else if (pathname.startsWith('/news/') || pathname.startsWith('/newsletter/') || pathname.startsWith('/ecosystem/')) {
		response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=604800');
	}

	return response;
};
