import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { posts, categories, users, revisions } from '#lib/server/db/schema';
import { eq, desc, and, isNull, isNotNull, ilike } from 'drizzle-orm';
import { requireRole } from '#lib/server/auth';
import { logAudit } from '#lib/server/audit';
import { slugify } from '#lib/utils';

export const load: PageServerLoad = async ({ url, locals }) => {
	const user = locals.user!;
	const statusFilter = url.searchParams.get('status') || 'all';
	const kindFilter = url.searchParams.get('kind') || 'all';
	const search = (url.searchParams.get('q') || '').trim();

	// Build query conditions
	const conditions: any[] = [];

	if (statusFilter === 'deleted') {
		conditions.push(isNotNull(posts.deletedAt));
	} else {
		conditions.push(isNull(posts.deletedAt));
		if (statusFilter !== 'all') {
			conditions.push(eq(posts.status, statusFilter as any));
		}
	}

	if (kindFilter !== 'all') {
		conditions.push(eq(posts.kind, kindFilter as any));
	}

	if (search) {
		conditions.push(ilike(posts.title, `%${search}%`));
	}

	const postsList = await db.query.posts.findMany({
		where: conditions.length > 0 ? and(...conditions) : undefined,
		orderBy: [desc(posts.updatedAt)],
		columns: {
			id: true,
			title: true,
			slug: true,
			kind: true,
			status: true,
			readingMinutes: true,
			publishedAt: true,
			scheduledFor: true,
			deletedAt: true,
			updatedAt: true,
			createdAt: true
		},
		with: {
			author: {
				columns: { id: true, name: true, email: true }
			},
			category: {
				columns: { id: true, name: true, slug: true }
			}
		}
	});

	const categoriesList = await db.query.categories.findMany({
		orderBy: [desc(categories.createdAt)]
	});

	return {
		posts: postsList,
		categories: categoriesList,
		statusFilter,
		kindFilter,
		search,
		currentUser: user
	};
};

export const actions: Actions = {
	create: async (event) => {
		const user = requireRole(event.locals.user, ['author', 'editor', 'owner']);
		const formData = await event.request.formData();
		const title = (formData.get('title')?.toString() || '').trim() || 'Untitled Post';
		const kind = (formData.get('kind')?.toString() || 'article') as any;

		let baseSlug = slugify(title) || `post-${Date.now()}`;
		let slug = baseSlug;
		let counter = 2;

		while (true) {
			const existing = await db.query.posts.findFirst({
				where: and(eq(posts.slug, slug), isNull(posts.deletedAt))
			});
			if (!existing) break;
			slug = `${baseSlug}-${counter++}`;
		}

		const newId = crypto.randomUUID();

		await db.insert(posts).values({
			id: newId,
			title,
			slug,
			kind,
			authorId: user.id,
			status: 'draft',
			contentHtml: '<p>Start writing your content here...</p>',
			contentText: 'Start writing your content here...'
		});

		await logAudit({
			actorId: user.id,
			action: 'post.create',
			entityType: 'post',
			entityId: newId,
			diff: { title, slug, kind },
			event
		});

		throw redirect(303, `/admin/posts/${newId}`);
	},

	softDelete: async (event) => {
		const user = requireRole(event.locals.user, ['editor', 'owner']);
		const formData = await event.request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Post ID is required' });

		await db
			.update(posts)
			.set({ deletedAt: new Date() })
			.where(eq(posts.id, id));

		await logAudit({
			actorId: user.id,
			action: 'post.soft_delete',
			entityType: 'post',
			entityId: id,
			event
		});

		return { success: true };
	},

	restore: async (event) => {
		const user = requireRole(event.locals.user, ['owner']);
		const formData = await event.request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Post ID is required' });

		await db
			.update(posts)
			.set({ deletedAt: null })
			.where(eq(posts.id, id));

		await logAudit({
			actorId: user.id,
			action: 'post.restore',
			entityType: 'post',
			entityId: id,
			event
		});

		return { success: true };
	},

	hardDelete: async (event) => {
		const user = requireRole(event.locals.user, ['owner']);
		const formData = await event.request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Post ID is required' });

		await db.delete(posts).where(eq(posts.id, id));

		await logAudit({
			actorId: user.id,
			action: 'post.hard_delete',
			entityType: 'post',
			entityId: id,
			event
		});

		return { success: true };
	}
};
