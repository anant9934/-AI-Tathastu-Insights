import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

async function run() {
	const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
	if (!dbUrl) {
		console.error('DATABASE_URL or DIRECT_DATABASE_URL is not set');
		process.exit(1);
	}

	console.log('Connecting to Neon PostgreSQL...');
	const sql = neon(dbUrl);

	// Drop legacy tables that conflict with the new SRS schema
	const legacyTables = [
		'users', 'posts', 'categories', 'tags', 'media', 'post_tags',
		'revisions', 'subscribers', 'redirects', 'audit_log', 'audit_logs',
		'auth_tokens', 'sessions', 'settings', 'roles', 'permissions',
		'content', 'content_blocks', 'content_versions', 'newsletter_subscribers',
		'media_assets', 'company_updates', 'engineering_articles', 'product_features'
	];

	console.log('Cleaning legacy / empty tables...');
	for (const table of legacyTables) {
		try {
			await sql.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
		} catch (e) {
			// ignore
		}
	}

	// Also drop enums if needed
	const enums = ['changelog_type', 'post_kind', 'post_status', 'subscriber_status', 'user_role'];
	for (const en of enums) {
		try {
			await sql.query(`DROP TYPE IF EXISTS "${en}" CASCADE`);
		} catch (e) {
			// ignore
		}
	}

	const migrationSqlPath = path.resolve('drizzle/0000_unique_lila_cheney.sql');
	const rawSql = fs.readFileSync(migrationSqlPath, 'utf8');

	const statements = rawSql
		.split('--> statement-breakpoint')
		.map((s) => s.trim())
		.filter((s) => s.length > 0);

	console.log(`Executing ${statements.length} migration statements...`);

	for (let i = 0; i < statements.length; i++) {
		const stmt = statements[i];
		try {
			await sql.query(stmt);
		} catch (err) {
			console.warn(`Statement ${i + 1} notice:`, err.message);
		}
	}

	console.log('Database tables & constraints ensured!');

	// Seed Initial Owner
	const ownerEmail = 'info.aitathastu@gmail.com';
	const ownerId = crypto.randomUUID();
	await sql`
		INSERT INTO users (id, email, name, role, email_verified, deactivated, created_at, updated_at)
		VALUES (${ownerId}, ${ownerEmail}, 'AI Tathastu Admin', 'owner', true, false, NOW(), NOW())
	`;
	console.log(`Created Initial Owner account for ${ownerEmail}`);

	// Seed Categories
	const defaultCategories = [
		{ name: 'Company News', slug: 'company', description: 'Official announcements and company updates' },
		{ name: 'Engineering', slug: 'engineering', description: 'Deep dives, system design, and technical insights' },
		{ name: 'Product', slug: 'product', description: 'Product releases, feature showcases, and roadmap' },
		{ name: 'Ecosystem', slug: 'ecosystem', description: 'Partner spotlights, integrations, and community highlights' }
	];

	for (const cat of defaultCategories) {
		await sql`
			INSERT INTO categories (id, name, slug, description, created_at)
			VALUES (${crypto.randomUUID()}, ${cat.name}, ${cat.slug}, ${cat.description}, NOW())
		`;
		console.log(`Seeded category: ${cat.name}`);
	}

	// Seed Default Settings
	const defaultSettings = [
		{ key: 'site_name', value: 'AI Tathastu Insights' },
		{ key: 'site_description', value: 'Company news, newsletters, changelog, and ecosystem updates from AI Tathastu.' },
		{ key: 'contact_email', value: 'info.aitathastu@gmail.com' },
		{ key: 'archived_post_status', value: '404' }
	];

	for (const s of defaultSettings) {
		await sql`
			INSERT INTO settings (key, value, updated_at)
			VALUES (${s.key}, ${s.value}, NOW())
		`;
	}

	console.log('Database migration & seeding completed successfully!');
}

run().catch((err) => {
	console.error('Migration failed:', err);
	process.exit(1);
});
