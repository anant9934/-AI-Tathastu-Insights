import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireRole } from '#lib/server/auth';
import { generateSignedUploadParams } from '#lib/server/cloudinary';
import { checkRateLimit } from '#lib/server/rate-limit';

export const POST: RequestHandler = async (event) => {
	const user = requireRole(event.locals.user, ['author', 'editor', 'owner']);

	// Rate limit: 50 / hour / user (BR-MED-01.4)
	const limit = checkRateLimit({
		key: `media_sign:${user.id}`,
		limit: 50,
		windowMs: 60 * 60 * 1000
	});

	if (!limit.success) {
		throw error(429, 'Upload signing rate limit exceeded. Try again in an hour.');
	}

	try {
		const signedParams = generateSignedUploadParams('aitathastu');
		return json(signedParams);
	} catch (err: any) {
		console.error('[Cloudinary Sign Error]', err);
		throw error(500, 'Failed to generate upload signature');
	}
};
