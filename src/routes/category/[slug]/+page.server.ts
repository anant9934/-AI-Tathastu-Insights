import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { categories, posts } from '#lib/server/db/schema';
import { eq, and, desc, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const category = await db.query.categories.findFirst({
		where: eq(categories.slug, slug)
	});

	if (!category) {
		throw error(404, 'Category not found');
	}

	const categoryPosts = await db.query.posts.findMany({
		where: and(
			isNull(posts.deletedAt),
			eq(posts.status, 'published'),
			eq(posts.categoryId, category.id)
		),
		orderBy: [desc(posts.publishedAt)],
		limit: 24,
		with: {
			author: { columns: { name: true } },
			coverMedia: true
		}
	});

	return {
		category,
		posts: categoryPosts
	};
};
