interface RateLimitEntry {
	count: number;
	resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired rate limit keys
setInterval(() => {
	const now = Date.now();
	for (const [key, entry] of rateLimitStore.entries()) {
		if (now > entry.resetTime) {
			rateLimitStore.delete(key);
		}
	}
}, 60 * 1000);

export interface RateLimitOptions {
	key: string;
	limit: number;
	windowMs: number;
}

export interface RateLimitResult {
	success: boolean;
	remaining: number;
	resetTime: number;
	retryAfterSeconds?: number;
}

export function checkRateLimit({
	key,
	limit,
	windowMs
}: RateLimitOptions): RateLimitResult {
	const now = Date.now();
	let entry = rateLimitStore.get(key);

	if (!entry || now > entry.resetTime) {
		entry = {
			count: 1,
			resetTime: now + windowMs
		};
		rateLimitStore.set(key, entry);
		return {
			success: true,
			remaining: limit - 1,
			resetTime: entry.resetTime
		};
	}

	if (entry.count >= limit) {
		const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
		return {
			success: false,
			remaining: 0,
			resetTime: entry.resetTime,
			retryAfterSeconds: Math.max(1, retryAfterSeconds)
		};
	}

	entry.count += 1;
	return {
		success: true,
		remaining: limit - entry.count,
		resetTime: entry.resetTime
	};
}
