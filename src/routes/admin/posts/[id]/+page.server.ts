import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { posts, categories, tags, postTags, media, revisions, redirects } from '#lib/server/db/schema';
import { eq, and, desc, isNull, ne } from 'drizzle-orm';
import { requireRole } from '#lib/server/auth';
import { logAudit } from '#lib/server/audit';
import {
	sanitizePostHtml,
	extractPlainText,
	calculateReadingTimeMinutes,
	deriveExcerpt,
	slugify,
	isReservedSlug
} from '#lib/server/sanitize';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.user!;
	const postId = params.id;

	const post = await db.query.posts.findFirst({
		where: eq(posts.id, postId),
		with: {
			author: true,
			category: true,
			coverMedia: true,
			postTags: {
				with: {
					tag: true
				}
			},
			revisions: {
				orderBy: [desc(revisions.createdAt)],
				limit: 20
			}
		}
	});

	if (!post) {
		throw error(404, 'Post not found');
	}

	// Permission check (Author can edit only own posts; Editor/Owner can edit any)
	if (user.role === 'author' && post.authorId !== user.id) {
		throw error(403, 'Forbidden: You can only edit your own posts');
	}

	const allCategories = await db.query.categories.findMany({
		orderBy: [desc(categories.name)]
	});

	const allMedia = await db.query.media.findMany({
		orderBy: [desc(media.createdAt)],
		limit: 50
	});

	return {
		post,
		categories: allCategories,
		mediaList: allMedia,
		currentUser: user
	};
};

export const actions: Actions = {
	save: async (event) => {
		const user = requireRole(event.locals.user, ['author', 'editor', 'owner']);
		const formData = await event.request.formData();
		const postId = event.params.id;

		const currentPost = await db.query.posts.findFirst({
			where: eq(posts.id, postId)
		});

		if (!currentPost) return fail(404, { error: 'Post not found' });
		if (user.role === 'author' && currentPost.authorId !== user.id) {
			return fail(403, { error: 'Forbidden' });
		}

		const title = (formData.get('title')?.toString() || '').trim() || 'Untitled Post';
		let slug = slugify(formData.get('slug')?.toString() || title);
		const kind = (formData.get('kind')?.toString() || 'article') as any;
		const categoryId = formData.get('categoryId')?.toString() || null;
		const coverMediaId = formData.get('coverMediaId')?.toString() || null;
		const changelogType = (formData.get('changelogType')?.toString() || null) as any;
		let excerpt = (formData.get('excerpt')?.toString() || '').trim();
		const contentHtmlRaw = formData.get('contentHtml')?.toString() || '';
		const seoTitle = (formData.get('seoTitle')?.toString() || '').trim() || null;
		const seoDescription = (formData.get('seoDescription')?.toString() || '').trim() || null;
		const scheduledForStr = formData.get('scheduledFor')?.toString();
		const scheduledFor = scheduledForStr ? new Date(scheduledForStr) : null;

		// Reserved slug validation
		if (isReservedSlug(slug)) {
			slug = `${slug}-post`;
		}

		// Unique slug check
		const existingWithSlug = await db.query.posts.findFirst({
			where: and(eq(posts.slug, slug), isNull(posts.deletedAt), ne(posts.id, postId))
		});
		if (existingWithSlug) {
			slug = `${slug}-${Date.now().toString().slice(-4)}`;
		}

		// Slug redirect check for published posts (BR-CMS-05.4 & FR-PUB-13)
		if (currentPost.status === 'published' && currentPost.slug !== slug) {
			const hubMap: Record<string, string> = {
				article: 'news',
				announcement: 'news',
				newsletter: 'newsletter',
				changelog: 'changelog'
			};
			const oldPath = `/${hubMap[currentPost.kind] || 'news'}/${currentPost.slug}`;
			const newPath = `/${hubMap[kind] || 'news'}/${slug}`;

			try {
				await db
					.insert(redirects)
					.values({
						fromPath: oldPath,
						toPath: newPath,
						status: 301
					})
					.onConflictDoUpdate({
						target: redirects.fromPath,
						set: { toPath: newPath, status: 301 }
					});
			} catch (e) {
				console.warn('Redirect creation failed:', e);
			}
		}

		// Sanitize HTML and derive fields (FR-CMS-16, FR-CMS-17)
		const cleanHtml = sanitizePostHtml(contentHtmlRaw);
		const plainText = extractPlainText(cleanHtml);
		const readingMinutes = calculateReadingTimeMinutes(plainText);

		if (!excerpt) {
			excerpt = deriveExcerpt(plainText, 160);
		}

		// Update post record
		await db
			.update(posts)
			.set({
				title,
				slug,
				kind,
				categoryId: categoryId || null,
				coverMediaId: coverMediaId || null,
				changelogType: kind === 'changelog' ? changelogType : null,
				excerpt,
				contentHtml: cleanHtml,
				contentText: plainText,
				readingMinutes,
				seoTitle,
				seoDescription,
				scheduledFor,
				updatedAt: new Date()
			})
			.where(eq(posts.id, postId));

		// Snapshot revision (FR-CMS-12)
		await db.insert(revisions).values({
			postId,
			snapshot: {
				title,
				slug,
				kind,
				excerpt,
				contentHtml: cleanHtml,
				savedAt: new Date().toISOString()
			},
			createdBy: user.id
		});

		await logAudit({
			actorId: user.id,
			action: 'post.update',
			entityType: 'post',
			entityId: postId,
			diff: { title, slug, kind },
			event
		});

		return { success: true, savedAt: new Date().toLocaleTimeString() };
	},

	publish: async (event) => {
		const user = requireRole(event.locals.user, ['editor', 'owner']);
		const postId = event.params.id;

		const currentPost = await db.query.posts.findFirst({
			where: eq(posts.id, postId)
		});

		if (!currentPost) return fail(404, { error: 'Post not found' });
		if (!currentPost.title) return fail(400, { error: 'A title is required to publish' });

		const now = new Date();

		await db
			.update(posts)
			.set({
				status: 'published',
				publishedAt: currentPost.publishedAt || now,
				updatedAt: now
			})
			.where(eq(posts.id, postId));

		// Immutable publish revision snapshot
		await db.insert(revisions).values({
			postId,
			snapshot: {
				status: 'published',
				title: currentPost.title,
				slug: currentPost.slug,
				publishedAt: now.toISOString()
			},
			createdBy: user.id
		});

		await logAudit({
			actorId: user.id,
			action: 'post.publish',
			entityType: 'post',
			entityId: postId,
			event
		});

		return { success: true, status: 'published' };
	},

	schedule: async (event) => {
		const user = requireRole(event.locals.user, ['editor', 'owner']);
		const formData = await event.request.formData();
		const postId = event.params.id;
		const scheduledForStr = formData.get('scheduledFor')?.toString();

		if (!scheduledForStr) {
			return fail(400, { error: 'Please choose a future date and time' });
		}

		const scheduledFor = new Date(scheduledForStr);
		if (isNaN(scheduledFor.getTime()) || scheduledFor.getTime() <= Date.now()) {
			return fail(400, { error: 'Scheduled time must be in the future' });
		}

		await db
			.update(posts)
			.set({
				status: 'scheduled',
				scheduledFor,
				updatedAt: new Date()
			})
			.where(eq(posts.id, postId));

		await logAudit({
			actorId: user.id,
			action: 'post.schedule',
			entityType: 'post',
			entityId: postId,
			diff: { scheduledFor: scheduledFor.toISOString() },
			event
		});

		return { success: true, status: 'scheduled' };
	},

	unpublish: async (event) => {
		const user = requireRole(event.locals.user, ['editor', 'owner']);
		const postId = event.params.id;

		await db
			.update(posts)
			.set({
				status: 'draft',
				updatedAt: new Date()
			})
			.where(eq(posts.id, postId));

		await logAudit({
			actorId: user.id,
			action: 'post.unpublish',
			entityType: 'post',
			entityId: postId,
			event
		});

		return { success: true, status: 'draft' };
	},

	archive: async (event) => {
		const user = requireRole(event.locals.user, ['editor', 'owner']);
		const postId = event.params.id;

		await db
			.update(posts)
			.set({
				status: 'archived',
				updatedAt: new Date()
			})
			.where(eq(posts.id, postId));

		await logAudit({
			actorId: user.id,
			action: 'post.archive',
			entityType: 'post',
			entityId: postId,
			event
		});

		return { success: true, status: 'archived' };
	},

	duplicate: async (event) => {
		const user = requireRole(event.locals.user, ['editor', 'owner']);
		const postId = event.params.id;

		const original = await db.query.posts.findFirst({
			where: eq(posts.id, postId)
		});

		if (!original) return fail(404, { error: 'Original post not found' });

		const newId = crypto.randomUUID();
		const copyTitle = `${original.title} (copy)`;
		const copySlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;

		await db.insert(posts).values({
			id: newId,
			title: copyTitle,
			slug: copySlug,
			kind: original.kind,
			categoryId: original.categoryId,
			coverMediaId: original.coverMediaId,
			excerpt: original.excerpt,
			contentHtml: original.contentHtml,
			contentText: original.contentText,
			readingMinutes: original.readingMinutes,
			authorId: user.id,
			status: 'draft'
		});

		await logAudit({
			actorId: user.id,
			action: 'post.duplicate',
			entityType: 'post',
			entityId: newId,
			diff: { duplicatedFrom: postId },
			event
		});

		throw redirect(303, `/admin/posts/${newId}`);
	}
};
