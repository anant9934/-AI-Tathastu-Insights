import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function seedDemo() {
	const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
	const sql = neon(dbUrl);

	// Get Owner user
	const users = await sql`SELECT id, name FROM users WHERE role = 'owner' LIMIT 1`;
	if (users.length === 0) {
		console.error('No owner user found to author posts');
		return;
	}
	const authorId = users[0].id;

	// Get Categories
	const categories = await sql`SELECT id, slug, name FROM categories`;
	const catMap = {};
	for (const c of categories) {
		catMap[c.slug] = c.id;
	}

	console.log('Seeding rich editorial media...');

	const demoMedia = [
		{
			publicId: 'editorial/ai-tathastu-2-0',
			secureUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&h=900&q=80',
			altText: 'Abstract generative architectural wave with deep teal and blue volumetric lighting',
			width: 1600,
			height: 900,
			format: 'jpg',
			bytes: 215400
		},
		{
			publicId: 'editorial/distributed-systems',
			secureUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&h=900&q=80',
			altText: 'Enterprise server hardware rack with glowing optical interconnects and fiber cables',
			width: 1600,
			height: 900,
			format: 'jpg',
			bytes: 198200
		},
		{
			publicId: 'editorial/dispatch-42',
			secureUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&h=900&q=80',
			altText: 'Futuristic glowing digital sphere with neural pathway visualizations',
			width: 1600,
			height: 900,
			format: 'jpg',
			bytes: 184500
		},
		{
			publicId: 'editorial/knowledge-graphs',
			secureUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&h=900&q=80',
			altText: 'Matrix binary code and multidimensional data connection graph',
			width: 1600,
			height: 900,
			format: 'jpg',
			bytes: 242100
		},
		{
			publicId: 'editorial/core-engine',
			secureUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&h=900&q=80',
			altText: 'Macro photography of high-density silicon microprocessor wafer architecture',
			width: 1600,
			height: 900,
			format: 'jpg',
			bytes: 231000
		},
		{
			publicId: 'editorial/agent-standards',
			secureUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&h=900&q=80',
			altText: 'Engineering design blueprint and systems architecture telemetry diagrams',
			width: 1600,
			height: 900,
			format: 'jpg',
			bytes: 176800
		},
		{
			publicId: 'editorial/latency-optimization',
			secureUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&h=900&q=80',
			altText: 'Interactive performance monitoring charts and latency distribution benchmarks',
			width: 1600,
			height: 900,
			format: 'jpg',
			bytes: 204300
		},
		{
			publicId: 'editorial/partner-telemetry',
			secureUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&h=900&q=80',
			altText: 'Software engineers collaborating over multi-agent telemetry and system architecture',
			width: 1600,
			height: 900,
			format: 'jpg',
			bytes: 219000
		},
		{
			publicId: 'editorial/fintech-intelligence',
			secureUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&h=900&q=80',
			altText: 'Reflective architectural corporate skyscraper representing enterprise compliance and security',
			width: 1600,
			height: 900,
			format: 'jpg',
			bytes: 245000
		},
		{
			publicId: 'editorial/community-hackathon',
			secureUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&h=900&q=80',
			altText: 'Global developer community hackathon team innovating autonomous agent prototypes',
			width: 1600,
			height: 900,
			format: 'jpg',
			bytes: 228000
		}
	];

	const mediaMap = {};
	for (const m of demoMedia) {
		const existing = await sql`SELECT id FROM media WHERE public_id = ${m.publicId} LIMIT 1`;
		if (existing.length > 0) {
			mediaMap[m.publicId] = existing[0].id;
		} else {
			const id = crypto.randomUUID();
			await sql`
				INSERT INTO media (id, public_id, secure_url, format, width, height, bytes, alt_text, uploaded_by, created_at)
				VALUES (${id}, ${m.publicId}, ${m.secureUrl}, ${m.format}, ${m.width}, ${m.height}, ${m.bytes}, ${m.altText}, ${authorId}, NOW())
			`;
			mediaMap[m.publicId] = id;
			console.log(`Seeded media: ${m.publicId}`);
		}
	}

	console.log('Seeding rich demo posts with cover imagery...');

	const demoPosts = [
		{
			kind: 'announcement',
			slug: 'announcing-ai-tathastu-2-0',
			title: 'Announcing AI Tathastu 2.0: The Autonomous Intelligence Platform',
			excerpt: 'Today we are introducing AI Tathastu 2.0, featuring multi-agent workflow orchestration, self-healing runtime diagnostics, and enterprise knowledge graph synchronization.',
			categoryId: catMap['company'] || categories[0]?.id,
			coverMediaId: mediaMap['editorial/ai-tathastu-2-0'],
			status: 'published',
			publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
			contentHtml: `
<h2>The Next Evolution of Enterprise Intelligence</h2>
<p>Today marks a seminal milestone for our engineering team and our global community of partners. Over the past twelve months, we have rearchitected the foundation of <strong>AI Tathastu</strong> to deliver unprecedented agentic reliability and low-latency decisioning.</p>
`,
			readingMinutes: 3
		},
		{
			kind: 'article',
			slug: 'building-resilient-distributed-systems',
			title: 'Architectural Deep-Dive: Building Resilient Edge-First Applications',
			excerpt: 'An in-depth engineering exploration of stale-while-revalidate caching, serverless execution boundaries, and zero-downtime database migrations with Neon Postgres.',
			categoryId: catMap['engineering'] || categories[0]?.id,
			coverMediaId: mediaMap['editorial/distributed-systems'],
			status: 'published',
			publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
			contentHtml: `
<h2>The Myth of Absolute Serverless Availability</h2>
<p>When engineering modern web platforms designed for high read:write skew (often exceeding 1,000:1), relying naively on cold function boots or direct database queries on every HTTP request is an anti-pattern.</p>
`,
			readingMinutes: 4
		},
		{
			kind: 'newsletter',
			slug: 'frontier-intelligence-dispatch-42',
			title: 'Frontier Intelligence Dispatch: Issue #42',
			excerpt: 'In this edition: The emergence of compound agent systems, speculative decoding benchmarks, and the shifting economics of serverless compute.',
			categoryId: catMap['product'] || categories[0]?.id,
			coverMediaId: mediaMap['editorial/dispatch-42'],
			status: 'published',
			publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
			contentHtml: `
<h2>Editorial Note: The Rise of Compound AI</h2>
<p>Welcome to the 42nd edition of the AI Tathastu Insights newsletter. Over the last month, the industry dialogue has shifted dramatically from single massive frontier models toward modular compound systems.</p>
`,
			readingMinutes: 3
		},
		{
			kind: 'article',
			slug: 'ecosystem-spotlight-vector-partners',
			title: 'Ecosystem Spotlight: Unifying Knowledge Graphs with Semantic Search',
			excerpt: 'How partner integrations with AI Tathastu enable hybrid lexical and semantic retrieval across millions of enterprise documents.',
			categoryId: catMap['ecosystem'] || categories[0]?.id,
			coverMediaId: mediaMap['editorial/knowledge-graphs'],
			status: 'published',
			publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
			contentHtml: `
<h2>The Intersection of Graphs and Vectors</h2>
<p>Pure vector search excels at conceptual similarity but frequently struggles with strict hierarchical relationships. Conversely, traditional knowledge graphs provide rigid truth but lack semantic flexibility.</p>
`,
			readingMinutes: 2
		},
		{
			kind: 'article',
			slug: 'partner-deepdive-open-agent-runtimes',
			title: 'Partner Deep Dive: Accelerating Real-Time Telemetry with Open Agent Standards',
			excerpt: 'Exploring how cloud providers and enterprise infrastructure teams are embedding standardized agent verification into production clusters.',
			categoryId: catMap['ecosystem'] || categories[0]?.id,
			coverMediaId: mediaMap['editorial/partner-telemetry'],
			status: 'published',
			publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
			contentHtml: `
<h2>Standardizing Telemetry Across Multi-Agent Swarms</h2>
<p>When autonomous agents execute concurrent tasks across distinct infrastructure boundaries, standardized trace envelopes become critical for observability and security governance.</p>
`,
			readingMinutes: 3
		},
		{
			kind: 'article',
			slug: 'enterprise-showcase-fintech-intelligence',
			title: 'Enterprise Showcase: Autonomous Compliance Workflows in Global Financial Services',
			excerpt: 'Case study on how institutional asset managers achieve deterministic auditability and continuous compliance monitoring with AI Tathastu.',
			categoryId: catMap['ecosystem'] || categories[0]?.id,
			coverMediaId: mediaMap['editorial/fintech-intelligence'],
			status: 'published',
			publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
			contentHtml: `
<h2>Zero-Tolerance Verification in Regulated Environments</h2>
<p>In high-stakes financial operations, probabilistic outputs cannot be permitted to execute mutations directly. Deterministic guardrails and immutable audit logging provide the required bridge.</p>
`,
			readingMinutes: 4
		},
		{
			kind: 'article',
			slug: 'community-roundup-q4-hackathon',
			title: 'Community Roundup: Highlights and Winners from the Global Agentic Hackathon',
			excerpt: 'Over 1,200 developers participated in building next-generation educational tools, developer plugins, and self-healing systems on the AI Tathastu platform.',
			categoryId: catMap['ecosystem'] || categories[0]?.id,
			coverMediaId: mediaMap['editorial/community-hackathon'],
			status: 'published',
			publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
			contentHtml: `
<h2>Celebrating Community Innovation</h2>
<p>Our fourth annual hackathon drew teams from 48 countries. In this recap we highlight the grand prize winners and open-source contributions now shipping to the ecosystem.</p>
`,
			readingMinutes: 3
		},
		{
			kind: 'changelog',
			slug: 'release-v2-4-0',
			title: 'Core Engine v2.4.0: Fast-Action Bursts & Edge Caching',
			excerpt: 'Introducing fast-action execution bursts, automatic image transformations via Cloudinary, and double opt-in newsletter confirmation.',
			categoryId: catMap['product'] || categories[0]?.id,
			coverMediaId: mediaMap['editorial/core-engine'],
			status: 'published',
			publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
			changelogType: 'new',
			contentHtml: `
<p>We are delighted to release v2.4.0 with comprehensive improvements across speed, security, and subscriber governance.</p>
`,
			readingMinutes: 2
		}
	];

	for (const p of demoPosts) {
		const existing = await sql`SELECT id FROM posts WHERE slug = ${p.slug} LIMIT 1`;
		if (existing.length === 0) {
			const id = crypto.randomUUID();
			await sql`
				INSERT INTO posts (
					id, kind, slug, title, excerpt, content_html, content_text,
					category_id, author_id, cover_media_id, status, published_at, scheduled_for,
					reading_minutes, changelog_type, created_at, updated_at
				) VALUES (
					${id},
					${p.kind},
					${p.slug},
					${p.title},
					${p.excerpt},
					${p.contentHtml},
					${p.excerpt},
					${p.categoryId},
					${authorId},
					${p.coverMediaId},
					${p.status},
					${p.publishedAt || null},
					${p.scheduledFor || null},
					${p.readingMinutes || 1},
					${p.changelogType || null},
					NOW(),
					NOW()
				)
			`;
			console.log(`Seeded post: "${p.title}" (${p.kind}, ${p.status})`);
		} else {
			await sql`
				UPDATE posts
				SET cover_media_id = ${p.coverMediaId},
					category_id = ${p.categoryId},
					excerpt = ${p.excerpt},
					content_html = ${p.contentHtml},
					updated_at = NOW()
				WHERE id = ${existing[0].id}
			`;
			console.log(`Updated post cover media: "${p.title}"`);
		}
	}

	console.log('Demo content seeding complete with verified imagery and ecosystem stories!');
}

seedDemo().catch((err) => {
	console.error('Seeding failed:', err);
	process.exit(1);
});
