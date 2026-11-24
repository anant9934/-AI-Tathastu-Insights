import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { posts } from '#lib/server/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ setHeaders }) => {
	// 1. Edge & Browser Caching: Stale-While-Revalidate for instant cache hit
	setHeaders({
		'cache-control': 'public, s-maxage=60, stale-while-revalidate=600'
	});

	// 2. Query Optimization (Space Complexity):
	// Project ONLY the required columns for the list view, strictly omitting heavy content_json & content_html
	const allPublished = await db.query.posts.findMany({
		where: and(eq(posts.status, 'published'), isNull(posts.deletedAt)),
		orderBy: [desc(posts.publishedAt)],
		limit: 15, // DOM & Memory bounded to 15 items maximum
		columns: {
			id: true,
			kind: true,
			slug: true,
			title: true,
			excerpt: true,
			publishedAt: true,
			readingMinutes: true,
			changelogType: true
		},
		with: {
			author: {
				columns: { name: true }
			},
			category: {
				columns: { name: true, slug: true }
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

	const featuredPost = allPublished[0] || null;
	const recentFive = allPublished.slice(1, 5);
	const latestNews = allPublished.filter((p) => p.kind === 'article' || p.kind === 'announcement').slice(0, 6);
	const ecosystemPosts = allPublished.filter((p) => p.kind === 'newsletter' || p.category?.slug === 'ecosystem').slice(0, 3);
	const changelogPosts = allPublished.filter((p) => p.kind === 'changelog').slice(0, 3);

	return {
		featuredPost,
		recentFive,
		latestNews,
		ecosystemPosts,
		changelogPosts
	};
};
