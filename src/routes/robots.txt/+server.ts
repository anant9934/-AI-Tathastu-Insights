import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api
Disallow: /api/
Disallow: /search
Disallow: /preview
Disallow: /preview/

Sitemap: https://aitathastu.info/sitemap.xml
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, s-maxage=86400'
		}
	});
};
