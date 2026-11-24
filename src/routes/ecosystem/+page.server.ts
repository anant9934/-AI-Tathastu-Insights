import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { posts, categories } from '#lib/server/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ setHeaders }) => {
	// 1. Edge & Browser Caching: Stale-While-Revalidate for instant cache hit
	setHeaders({
		'cache-control': 'public, s-maxage=60, stale-while-revalidate=600'
	});

	// 2. Query Optimization (Time & Space Complexity):
	// O(1) single index lookup for ecosystem category ID
	const ecoCategory = await db.query.categories.findFirst({
		where: eq(categories.slug, 'ecosystem'),
		columns: { id: true }
	});

	// 3. Selective Column Projection:
	// Strictly omit heavy content_json & content_html from DB query payload (saves >90% network bytes)
	const ecoPosts = await db.query.posts.findMany({
		where: and(
			isNull(posts.deletedAt),
			eq(posts.status, 'published'),
			ecoCategory ? eq(posts.categoryId, ecoCategory.id) : undefined
		),
		orderBy: [desc(posts.publishedAt)],
		limit: 15, // DOM & Memory bounded to 15 items maximum
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
			author: {
				columns: { name: true }
			},
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

	const featured = ecoPosts[0] || null;
	const grid = ecoPosts.slice(1);

	return {
		featured,
		posts: grid
	};
};
