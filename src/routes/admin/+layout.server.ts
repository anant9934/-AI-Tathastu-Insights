import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Exclude login and auth endpoints
	if (url.pathname.startsWith('/admin/login') || url.pathname.startsWith('/admin/auth')) {
		return { user: null };
	}

	if (!locals.user) {
		throw redirect(303, `/admin/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	return {
		user: locals.user
	};
};
