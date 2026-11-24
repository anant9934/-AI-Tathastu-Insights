import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { media, posts } from '#lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { requireRole } from '#lib/server/auth';
import { deleteCloudinaryAsset } from '#lib/server/cloudinary';
import { logAudit } from '#lib/server/audit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;

	const mediaItems = await db.query.media.findMany({
		orderBy: [desc(media.createdAt)],
		with: {
			uploader: {
				columns: { name: true }
			},
			posts: {
				columns: { id: true, title: true, slug: true }
			}
		}
	});

	return {
		mediaList: mediaItems,
		currentUser: user
	};
};

export const actions: Actions = {
	delete: async (event) => {
		const user = requireRole(event.locals.user, ['author', 'editor', 'owner']);
		const formData = await event.request.formData();
		const mediaId = formData.get('id')?.toString();

		if (!mediaId) return fail(400, { error: 'Media ID required' });

		const item = await db.query.media.findFirst({
			where: eq(media.id, mediaId)
		});

		if (!item) return fail(404, { error: 'Media asset not found' });

		// Authors may delete only their own assets (BR-MED-06.3)
		if (user.role === 'author' && item.uploadedBy !== user.id) {
			return fail(403, { error: 'Forbidden: You can only delete your own media' });
		}

		try {
			await deleteCloudinaryAsset(item.publicId);
		} catch (e) {
			console.warn('[Cloudinary Delete Notice]', e);
		}

		await db.delete(media).where(eq(media.id, mediaId));

		await logAudit({
			actorId: user.id,
			action: 'media.delete',
			entityType: 'media',
			entityId: mediaId,
			event
		});

		return { success: true };
	}
};
