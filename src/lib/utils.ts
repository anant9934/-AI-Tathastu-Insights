// Pre-compiled cached Intl.DateTimeFormat instance for O(1) allocation & fast formatting
const standardDateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric'
});

export function formatDate(d: Date | string | null | undefined): string {
	if (!d) return '—';
	try {
		return standardDateFormatter.format(typeof d === 'string' ? new Date(d) : d);
	} catch {
		return '—';
	}
}

export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.slice(0, 80)
		.replace(/^-+|-+$/g, '');
}

/**
 * High-performance Responsive Image helper (Space Complexity & CLS Optimization)
 * Injects automatic modern format negotiation (AVIF/WebP) and generates responsive srcset
 */
export function getResponsiveImageProps(
	url: string | null | undefined,
	options: {
		alt?: string;
		isHero?: boolean;
		aspect?: '16:9' | '1:1';
		sizes?: string;
	} = {}
) {
	if (!url) {
		return null;
	}

	const isHero = options.isHero ?? false;
	const isSquare = options.aspect === '1:1';
	const width = isSquare ? 200 : isHero ? 1600 : 800;
	const height = isSquare ? 200 : isHero ? 900 : 450;

	let src = url;
	let srcset = '';

	if (url.includes('res.cloudinary.com')) {
		// Cloudinary f_auto,q_auto dynamic responsive injection
		const uploadIndex = url.indexOf('/upload/');
		if (uploadIndex !== -1) {
			const prefix = url.slice(0, uploadIndex + 8);
			const suffix = url.slice(uploadIndex + 8).replace(/^([a-z0-9_:,]+\/)+/i, '');

			const widths = isSquare ? [64, 128, 200] : [400, 800, 1200, 1600];
			srcset = widths
				.map((w) => {
					const h = isSquare ? w : Math.round((w * 9) / 16);
					return `${prefix}w_${w},h_${h},c_fill,g_auto,f_auto,q_auto/${suffix} ${w}w`;
				})
				.join(', ');

			src = `${prefix}w_${width},h_${height},c_fill,g_auto,f_auto,q_auto/${suffix}`;
		}
	} else if (url.includes('images.unsplash.com')) {
		// Unsplash auto=format,fit=crop responsive injection
		const baseUrl = url.split('?')[0];
		const widths = isSquare ? [64, 128, 200] : [400, 800, 1200, 1600];
		srcset = widths
			.map((w) => {
				const h = isSquare ? w : Math.round((w * 9) / 16);
				return `${baseUrl}?w=${w}&h=${h}&auto=format&fit=crop&q=80 ${w}w`;
			})
			.join(', ');

		src = `${baseUrl}?w=${width}&h=${height}&auto=format&fit=crop&q=80`;
	}

	return {
		src,
		srcset: srcset || undefined,
		sizes: options.sizes || (isSquare ? '64px' : isHero ? '(max-width: 1024px) 100vw, 1200px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px'),
		alt: options.alt || '',
		width,
		height,
		loading: isHero ? ('eager' as const) : ('lazy' as const),
		fetchpriority: isHero ? ('high' as const) : ('auto' as const),
		decoding: 'async' as const
	};
}
