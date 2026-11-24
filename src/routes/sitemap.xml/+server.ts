import type { RequestHandler } from './$types';
import { db } from '#lib/server/db';
import { posts, categories } from '#lib/server/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	const siteUrl = 'https://aitathastu.info';

	// Published posts
	const allPosts = await db.query.posts.findMany({
		where: and(isNull(posts.deletedAt), eq(posts.status, 'published')),
		orderBy: [desc(posts.updatedAt)],
		columns: {
			slug: true,
			kind: true,
			updatedAt: true
		}
	});

	// Categories
	const allCategories = await db.query.categories.findMany({
		columns: {
			slug: true,
			createdAt: true
		}
	});

	const hubMap: Record<string, string> = {
		article: 'news',
		announcement: 'news',
		newsletter: 'newsletter',
		changelog: 'changelog'
	};

	const staticRoutes = [
		{ path: '', priority: '1.0', changefreq: 'daily' },
		{ path: '/news', priority: '0.9', changefreq: 'daily' },
		{ path: '/newsletter', priority: '0.9', changefreq: 'weekly' },
		{ path: '/ecosystem', priority: '0.8', changefreq: 'weekly' },
		{ path: '/changelog', priority: '0.8', changefreq: 'weekly' },
		{ path: '/subscribe', priority: '0.5', changefreq: 'monthly' },
		{ path: '/privacy', priority: '0.3', changefreq: 'yearly' }
	];

	const staticUrls = staticRoutes
		.map(
			(r) => `
  <url>
    <loc>${siteUrl}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
		)
		.join('');

	const categoryUrls = allCategories
		.map(
			(c) => `
  <url>
    <loc>${siteUrl}/category/${c.slug}</loc>
    <lastmod>${new Date(c.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
		)
		.join('');

	const postUrls = allPosts
		.map((p) => {
			const hub = hubMap[p.kind] || 'news';
			return `
  <url>
    <loc>${siteUrl}/${hub}/${p.slug}</loc>
    <lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
		})
		.join('');

	const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${categoryUrls}
${postUrls}
</urlset>`;

	return new Response(sitemapXml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, s-maxage=3600'
		}
	});
};
