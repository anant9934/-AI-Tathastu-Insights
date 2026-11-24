import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { posts } from '#lib/server/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ setHeaders }) => {
	// 1. Edge & Browser Caching: Stale-While-Revalidate header
	setHeaders({
		'cache-control': 'public, s-maxage=60, stale-while-revalidate=600'
	});

	// 2. Query Optimization (Space Complexity):
	// Omit content_json & content_html, project minimal columns, bound to 12 items
	const issues = await db.query.posts.findMany({
		where: and(isNull(posts.deletedAt), eq(posts.status, 'published'), eq(posts.kind, 'newsletter')),
		orderBy: [desc(posts.publishedAt)],
		limit: 12, // DOM bounded limit
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
		issues
	};
};
