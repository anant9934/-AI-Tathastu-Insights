import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { posts } from '#lib/server/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ setHeaders }) => {
	// 1. Edge Caching: Stale-While-Revalidate header
	setHeaders({
		'cache-control': 'public, s-maxage=60, stale-while-revalidate=600'
	});

	// 2. Query Optimization (Space Complexity):
	// Project only essential changelog columns, omitting heavy JSON documents
	const changelogEntries = await db.query.posts.findMany({
		where: and(isNull(posts.deletedAt), eq(posts.status, 'published'), eq(posts.kind, 'changelog')),
		orderBy: [desc(posts.publishedAt)],
		limit: 30, // Bounded memory allocation
		columns: {
			id: true,
			slug: true,
			title: true,
			excerpt: true,
			changelogType: true,
			publishedAt: true,
			createdAt: true
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

	// Group entries by Month & Year in O(N) single-pass
	const grouped: Record<string, typeof changelogEntries> = {};

	for (const entry of changelogEntries) {
		const date = new Date(entry.publishedAt || entry.createdAt);
		const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
		if (!grouped[monthKey]) {
			grouped[monthKey] = [];
		}
		grouped[monthKey].push(entry);
	}

	return {
		grouped
	};
};
