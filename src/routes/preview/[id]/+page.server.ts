import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { posts } from '#lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	// Require authenticated staff session (FR-CMS-13)
	if (!locals.user) {
		throw error(401, 'Authentication required to preview unpublished drafts');
	}

	const post = await db.query.posts.findFirst({
		where: eq(posts.id, params.id),
		with: {
			author: true,
			category: true,
			coverMedia: true
		}
	});

	if (!post) {
		throw error(404, 'Post draft not found');
	}

	return {
		post
	};
};
