import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { posts, subscribers, auditLog } from '#lib/server/db/schema';
import { eq, desc, isNull, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;

	// 1. Post counts
	const allPosts = await db.query.posts.findMany({
		where: isNull(posts.deletedAt),
		columns: {
			id: true,
			status: true
		}
	});

	const counts = {
		total: allPosts.length,
		published: allPosts.filter((p) => p.status === 'published').length,
		draft: allPosts.filter((p) => p.status === 'draft').length,
		scheduled: allPosts.filter((p) => p.status === 'scheduled').length,
		archived: allPosts.filter((p) => p.status === 'archived').length
	};

	// 2. Recent 5 posts
	const recentPosts = await db.query.posts.findMany({
		where: isNull(posts.deletedAt),
		orderBy: [desc(posts.updatedAt)],
		limit: 5,
		with: {
			author: {
				columns: { name: true }
			},
			category: {
				columns: { name: true }
			}
		}
	});

	// 3. Upcoming scheduled posts
	const scheduledPosts = await db.query.posts.findMany({
		where: and(isNull(posts.deletedAt), eq(posts.status, 'scheduled')),
		orderBy: [desc(posts.scheduledFor)],
		limit: 5,
		with: {
			author: {
				columns: { name: true }
			}
		}
	});

	// 4. Subscriber counts
	const allSubscribers = await db.query.subscribers.findMany({
		columns: {
			status: true
		}
	});

	const subscriberCounts = {
		total: allSubscribers.length,
		confirmed: allSubscribers.filter((s) => s.status === 'confirmed').length,
		pending: allSubscribers.filter((s) => s.status === 'pending').length,
		unsubscribed: allSubscribers.filter((s) => s.status === 'unsubscribed').length
	};

	// 5. Recent audit logs (Owner only)
	let recentAuditLogs: any[] = [];
	if (user.role === 'owner') {
		recentAuditLogs = await db.query.auditLog.findMany({
			orderBy: [desc(auditLog.createdAt)],
			limit: 8
		});
	}

	return {
		counts,
		recentPosts,
		scheduledPosts,
		subscriberCounts,
		recentAuditLogs
	};
};
