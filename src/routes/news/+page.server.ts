import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { posts, categories } from '#lib/server/db/schema';
import { eq, desc, and, isNull, inArray, lt } from 'drizzle-orm';

const PAGE_SIZE = 12; // Bounded DOM size limit (<= 12-15 items per page)

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	// 1. Edge & Browser Caching: Stale-While-Revalidate
	setHeaders({
		'cache-control': 'public, s-maxage=60, stale-while-revalidate=600'
	});

	const selectedCategory = url.searchParams.get('category');
	const cursor = url.searchParams.get('cursor');

	const conditions: any[] = [
		isNull(posts.deletedAt),
		eq(posts.status, 'published'),
		inArray(posts.kind, ['article', 'announcement'])
	];

	// Filter by category
	if (selectedCategory) {
		const cat = await db.query.categories.findFirst({
			where: eq(categories.slug, selectedCategory),
			columns: { id: true }
		});
		if (cat) {
			conditions.push(eq(posts.categoryId, cat.id));
		}
	}

	// 2. Keyset (Cursor-based) Pagination for O(1) DB indexing instead of O(N) OFFSET scans
	if (cursor) {
		const cursorDate = new Date(cursor);
		if (!isNaN(cursorDate.getTime())) {
			conditions.push(lt(posts.publishedAt, cursorDate));
		}
	}

	// 3. Selective Column Projection: Exclude heavy content_json & content_html
	const newsPosts = await db.query.posts.findMany({
		where: and(...conditions),
		orderBy: [desc(posts.publishedAt)],
		limit: PAGE_SIZE,
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
			category: { columns: { name: true, slug: true } },
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

	// Categories list projected with minimal columns
	const allCategories = await db.query.categories.findMany({
		orderBy: [desc(categories.name)],
		columns: {
			id: true,
			name: true,
			slug: true
		}
	});

	// Calculate next cursor for infinite scroll or cursor navigation
	const nextCursor = newsPosts.length === PAGE_SIZE ? newsPosts[newsPosts.length - 1].publishedAt?.toISOString() : null;

	const featured = !cursor && newsPosts.length > 0 ? newsPosts[0] : null;
	const grid = !cursor && newsPosts.length > 0 ? newsPosts.slice(1) : newsPosts;

	return {
		featured,
		posts: grid,
		categories: allCategories,
		selectedCategory,
		nextCursor
	};
};
