import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { posts } from '#lib/server/db/schema';
import { and, eq, isNull, desc, or, ilike } from 'drizzle-orm';
import { checkRateLimit } from '#lib/server/rate-limit';

export const load: PageServerLoad = async ({ url, getClientAddress, request }) => {
	const query = (url.searchParams.get('q') || '').trim();
	const clientIp = getClientAddress?.() || request.headers.get('x-forwarded-for') || '127.0.0.1';

	// Rate limit: 30 / min / IP (BR-PUB-08.3)
	const limit = checkRateLimit({
		key: `search:${clientIp}`,
		limit: 30,
		windowMs: 60 * 1000
	});

	if (!limit.success) {
		return {
			query,
			rateLimited: true,
			results: [],
			suggestions: []
		};
	}

	// Recent suggestions for 0 results or empty prompt (BR-PUB-08.2)
	const suggestions = await db.query.posts.findMany({
		where: and(isNull(posts.deletedAt), eq(posts.status, 'published')),
		orderBy: [desc(posts.publishedAt)],
		limit: 3,
		with: {
			author: { columns: { name: true } }
		}
	});

	if (query.length < 2) {
		return {
			query,
			tooShort: true,
			results: [],
			suggestions
		};
	}

	const results = await db.query.posts.findMany({
		where: and(
			isNull(posts.deletedAt),
			eq(posts.status, 'published'),
			or(
				ilike(posts.title, `%${query}%`),
				ilike(posts.contentText, `%${query}%`),
				ilike(posts.excerpt, `%${query}%`)
			)
		),
		orderBy: [desc(posts.publishedAt)],
		limit: 20,
		with: {
			author: { columns: { name: true } },
			category: { columns: { name: true, slug: true } }
		}
	});

	return {
		query,
		results,
		suggestions
	};
};
