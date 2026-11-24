import sanitizeHtml from 'sanitize-html';

export const ALLOWED_TAGS = [
	'p',
	'h2',
	'h3',
	'strong',
	'em',
	'code',
	'pre',
	'a',
	'ul',
	'ol',
	'li',
	'blockquote',
	'img',
	'figure',
	'figcaption',
	'hr',
	'br'
];

export const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
	a: ['href', 'name', 'target', 'rel', 'title'],
	img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
	'*': ['class']
};

export function sanitizePostHtml(dirtyHtml: string): string {
	if (!dirtyHtml) return '';

	return sanitizeHtml(dirtyHtml, {
		allowedTags: ALLOWED_TAGS,
		allowedAttributes: ALLOWED_ATTRIBUTES,
		allowedSchemes: ['http', 'https', 'mailto'],
		transformTags: {
			a: (tagName, attribs) => {
				const href = attribs.href || '';
				const isExternal = href.startsWith('http://') || href.startsWith('https://');
				return {
					tagName: 'a',
					attribs: {
						...attribs,
						...(isExternal
							? {
									target: '_blank',
									rel: 'noopener noreferrer'
								}
							: {})
					}
				};
			}
		}
	});
}

export function extractPlainText(html: string): string {
	if (!html) return '';
	return sanitizeHtml(html, {
		allowedTags: [],
		allowedAttributes: {}
	})
		.replace(/\s+/g, ' ')
		.trim();
}

export function calculateReadingTimeMinutes(text: string): number {
	if (!text) return 1;
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.ceil(words / 200);
	return Math.max(1, minutes);
}

export function deriveExcerpt(text: string, maxChars = 160): string {
	if (!text) return '';
	const clean = text.trim();
	if (clean.length <= maxChars) return clean;
	return clean.substring(0, maxChars).trim() + '…';
}

export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.normalize('NFD') // separate accent from letter
		.replace(/[\u0300-\u036f]/g, '') // remove accents
		.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-') // collapse dashes
		.slice(0, 80)
		.replace(/^-+|-+$/g, ''); // trim dashes
}

export const RESERVED_SLUGS = [
	'admin',
	'api',
	'rss',
	'rss.xml',
	'sitemap',
	'sitemap.xml',
	'robots.txt',
	'search',
	'news',
	'newsletter',
	'ecosystem',
	'changelog',
	'category',
	'login',
	'logout',
	'subscribe',
	'unsubscribe',
	'confirm'
];

export function isReservedSlug(slug: string): boolean {
	return RESERVED_SLUGS.includes(slug.toLowerCase());
}
