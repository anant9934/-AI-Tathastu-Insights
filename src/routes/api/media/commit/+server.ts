import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireRole } from '#lib/server/auth';
import { verifyAndGetAsset } from '#lib/server/cloudinary';
import { db } from '#lib/server/db';
import { media } from '#lib/server/db/schema';
import { logAudit } from '#lib/server/audit';

export const POST: RequestHandler = async (event) => {
	const user = requireRole(event.locals.user, ['author', 'editor', 'owner']);
	const body = await event.request.json();
	const { publicId, altText, decorative } = body;

	if (!publicId) {
		throw error(400, 'Missing publicId');
	}

	// Mandatory alt text check (BR-MED-03.1)
	const isDecorative = Boolean(decorative);
	const cleanAlt = (altText || '').trim();

	if (!isDecorative && (!cleanAlt || cleanAlt.length < 1)) {
		throw error(400, 'Alt text is mandatory unless marked decorative.');
	}

	if (cleanAlt.length > 250) {
		throw error(400, 'Alt text must be 250 characters or less.');
	}

	try {
		// Verify on Cloudinary
		const asset = await verifyAndGetAsset(publicId);

		const newMediaId = crypto.randomUUID();

		await db.insert(media).values({
			id: newMediaId,
			publicId: asset.publicId,
			secureUrl: asset.secureUrl,
			format: asset.format,
			width: asset.width,
			height: asset.height,
			bytes: asset.bytes,
			altText: isDecorative ? '' : cleanAlt,
			decorative: isDecorative,
			uploadedBy: user.id
		});

		await logAudit({
			actorId: user.id,
			action: 'media.upload',
			entityType: 'media',
			entityId: newMediaId,
			diff: { publicId: asset.publicId, bytes: asset.bytes },
			event
		});

		return json({
			success: true,
			media: {
				id: newMediaId,
				publicId: asset.publicId,
				secureUrl: asset.secureUrl,
				width: asset.width,
				height: asset.height,
				bytes: asset.bytes,
				altText: cleanAlt,
				decorative: isDecorative
			}
		});
	} catch (err: any) {
		console.error('[Media Commit Error]', err);
		throw error(500, err.message || 'Failed to commit media asset');
	}
};
