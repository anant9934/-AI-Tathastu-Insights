import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '#lib/server/db';
import { posts, revisions } from '#lib/server/db/schema';
import { eq, and, isNull, lte } from 'drizzle-orm';
import { logAudit } from '#lib/server/audit';

export const GET: RequestHandler = async (event) => {
	// Verify Vercel Cron authorization header or allow in development
	const authHeader = event.request.headers.get('authorization');
	const cronSecret = process.env.CRON_SECRET;

	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return json({ error: 'Unauthorized cron invocation' }, { status: 401 });
	}

	const now = new Date();

	// Select posts ready to publish (FR-SYS-07.2)
	const readyPosts = await db.query.posts.findMany({
		where: and(
			isNull(posts.deletedAt),
			eq(posts.status, 'scheduled'),
			lte(posts.scheduledFor, now)
		)
	});

	let publishedCount = 0;

	for (const post of readyPosts) {
		try {
			// Idempotent atomic update (FR-SYS-07.3)
			await db
				.update(posts)
				.set({
					status: 'published',
					publishedAt: now,
					updatedAt: now
				})
				.where(eq(posts.id, post.id));

			await db.insert(revisions).values({
				postId: post.id,
				snapshot: {
					status: 'published',
					title: post.title,
					slug: post.slug,
					publishedVia: 'cron_scheduler',
					publishedAt: now.toISOString()
				}
			});

			await logAudit({
				action: 'cron.scheduled_publish',
				entityType: 'post',
				entityId: post.id,
				event
			});

			publishedCount++;
		} catch (err) {
			console.error(`[Cron Publish] Failed to publish post ${post.id}:`, err);
		}
	}

	return json({
		success: true,
		timestamp: now.toISOString(),
		checkedCount: readyPosts.length,
		publishedCount
	});
};
