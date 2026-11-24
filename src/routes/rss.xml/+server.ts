import type { RequestHandler } from './$types';
import { db } from '#lib/server/db';
import { posts } from '#lib/server/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	const recentPosts = await db.query.posts.findMany({
		where: and(isNull(posts.deletedAt), eq(posts.status, 'published')),
		orderBy: [desc(posts.publishedAt)],
		limit: 30,
		with: {
			author: { columns: { name: true } }
		}
	});

	const siteUrl = 'https://aitathastu.info';

	const hubMap: Record<string, string> = {
		article: 'news',
		announcement: 'news',
		newsletter: 'newsletter',
		changelog: 'changelog'
	};

	const xmlItems = recentPosts
		.map((p) => {
			const hub = hubMap[p.kind] || 'news';
			const link = `${siteUrl}/${hub}/${p.slug}`;
			const pubDate = new Date(p.publishedAt || p.createdAt).toUTCString();
			const titleEscaped = p.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			const descEscaped = (p.excerpt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

			return `
    <item>
      <title>${titleEscaped}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${descEscaped}</description>
      <author>${p.author.name}</author>
    </item>`;
		})
		.join('');

	const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Tathastu Insights</title>
    <link>${siteUrl}</link>
    <description>Company news, newsletter editions, and ecosystem insights from AI Tathastu.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${xmlItems}
  </channel>
</rss>`;

	return new Response(rssXml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, s-maxage=3600'
		}
	});
};
