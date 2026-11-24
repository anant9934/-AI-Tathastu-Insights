import { v2 as cloudinary } from 'cloudinary';

let cName = process.env.CLOUDINARY_CLOUD_NAME;
let cKey = process.env.CLOUDINARY_API_KEY;
let cSecret = process.env.CLOUDINARY_API_SECRET;

try {
	const { env } = await import('$env/dynamic/private');
	if (env) {
		if (env.CLOUDINARY_CLOUD_NAME) cName = env.CLOUDINARY_CLOUD_NAME;
		if (env.CLOUDINARY_API_KEY) cKey = env.CLOUDINARY_API_KEY;
		if (env.CLOUDINARY_API_SECRET) cSecret = env.CLOUDINARY_API_SECRET;
	}
} catch (e) {
	// Standalone script fallback
}

cloudinary.config({
	cloud_name: cName,
	api_key: cKey,
	api_secret: cSecret,
	secure: true
});

export const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg', 'pdf'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function generateSignedUploadParams(folder: string = 'aitathastu') {
	const timestamp = Math.round(new Date().getTime() / 1000);

	if (!cSecret || !cKey || !cName) {
		throw new Error('Cloudinary credentials are not configured');
	}

	const paramsToSign = {
		folder,
		timestamp
	};

	const signature = cloudinary.utils.api_sign_request(paramsToSign, cSecret);

	return {
		timestamp,
		signature,
		apiKey: cKey,
		cloudName: cName,
		folder,
		allowedFormats: ALLOWED_FORMATS,
		maxFileSize: MAX_FILE_SIZE_BYTES
	};
}

export async function verifyAndGetAsset(publicId: string) {
	try {
		const result = await cloudinary.api.resource(publicId, {
			resource_type: 'image'
		});
		return {
			publicId: result.public_id,
			secureUrl: result.secure_url,
			format: result.format,
			width: result.width || 0,
			height: result.height || 0,
			bytes: result.bytes || 0
		};
	} catch (err) {
		console.error('[Cloudinary] Failed to verify asset:', err);
		throw new Error('Asset verification failed on Cloudinary');
	}
}

export function getTransformedImageUrl(
	publicId: string,
	variant: 'card' | 'hero' | 'thumbnail' | 'raw' = 'card'
): string {
	const cloudName = cName || 'xrolmqvm';
	if (variant === 'raw') {
		return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
	}

	let transform = 'c_fill,g_auto,f_auto,q_auto:good';
	if (variant === 'card') {
		transform = `w_800,h_450,${transform}`;
	} else if (variant === 'hero') {
		transform = `w_1600,h_900,${transform}`;
	} else if (variant === 'thumbnail') {
		transform = `w_200,h_200,${transform}`;
	}

	return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}

export function getTransformedVideoUrl(
	publicId: string,
	options: { quality?: string; format?: string } = {}
): string {
	const cloudName = cName || 'xrolmqvm';
	const quality = options.quality || 'auto';
	const format = options.format || 'auto';
	return `https://res.cloudinary.com/${cloudName}/video/upload/q_${quality},f_${format},vc_auto/${publicId}`;
}

export async function deleteCloudinaryAsset(publicId: string) {
	try {
		const res = await cloudinary.uploader.destroy(publicId);
		return res;
	} catch (err) {
		console.error('[Cloudinary] Failed to delete asset:', err);
		throw err;
	}
}
