import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { posts } from '#lib/server/db/schema';
import { eq, and, isNull, ne, desc } from 'drizzle-orm';

const VALID_HUBS = ['news', 'newsletter', 'ecosystem'];

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const { hub, slug } = params;

	if (!VALID_HUBS.includes(hub)) {
		throw error(404, 'Hub not found');
	}

	// 1. Edge Caching: Stale-While-Revalidate header for fast content delivery
	setHeaders({
		'cache-control': 'public, s-maxage=60, stale-while-revalidate=600'
	});

	// 2. Fetch the target article (O(1) indexed slug lookup)
	const post = await db.query.posts.findFirst({
		where: and(eq(posts.slug, slug), eq(posts.status, 'published'), isNull(posts.deletedAt)),
		with: {
			author: true,
			category: true,
			coverMedia: true
		}
	});

	if (!post) {
		throw error(404, 'Article not found');
	}

	// 3. Selective Column Projection for Related Posts:
	// Strictly omit full body HTML/JSON from related posts, keeping payload light
	const related = await db.query.posts.findMany({
		where: and(
			isNull(posts.deletedAt),
			eq(posts.status, 'published'),
			ne(posts.id, post.id),
			post.categoryId ? eq(posts.categoryId, post.categoryId) : undefined
		),
		orderBy: [desc(posts.publishedAt)],
		limit: 3,
		columns: {
			id: true,
			kind: true,
			slug: true,
			title: true,
			excerpt: true,
			publishedAt: true,
			readingMinutes: true
		},
		with: {
			author: { columns: { name: true } },
			coverMedia: {
				columns: {
					id: true,
					secureUrl: true,
					altText: true,
					width: true,
					height: true
				}
			}
		}
	});

	return {
		post,
		related,
		hub
	};
};
