import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { sanitizePostHtml, extractPlainText } from '../src/lib/server/sanitize';
import { slugify } from '../src/lib/utils';
import { hashToken, generateToken, isRoleAllowed } from '../src/lib/server/auth';
import { checkRateLimit } from '../src/lib/server/rate-limit';

async function runAcceptanceTests() {
	console.log('=====================================================');
	console.log('RUNNING SRS-NEWS-001 ACCEPTANCE CRITERIA VERIFICATION');
	console.log('=====================================================\n');

	let passed = 0;
	let failed = 0;

	function assert(name: string, condition: boolean, message = '') {
		if (condition) {
			console.log(`[PASS] ${name}`);
			passed++;
		} else {
			console.error(`[FAIL] ${name}: ${message}`);
			failed++;
		}
	}

	// 1. E2E-09: XSS Content Sanitization (FR-CMS-16, FR-SEC-07)
	const maliciousInput = '<p>Normal text</p><script>alert("XSS")</script><img src="x" onerror="stealCookies()"><a href="javascript:void(0)">Click me</a>';
	const sanitized = sanitizePostHtml(maliciousInput);
	assert(
		'E2E-09: Content Sanitization strips <script>',
		!sanitized.includes('<script>') && !sanitized.includes('alert('),
		`Got: ${sanitized}`
	);
	assert(
		'E2E-09: Content Sanitization strips on* event handlers',
		!sanitized.includes('onerror='),
		`Got: ${sanitized}`
	);
	assert(
		'E2E-09: Content Sanitization strips javascript: pseudo-URLs',
		!sanitized.includes('javascript:'),
		`Got: ${sanitized}`
	);

	// 2. Token generation and SHA-256 Hashing (BR-AUTH-01.2, BR-AUTH-03.1)
	const token1 = generateToken(32);
	const hash1 = hashToken(token1);
	const hash2 = hashToken(token1);
	assert('BR-AUTH-01.2: Token hashing is deterministic SHA-256', hash1 === hash2);
	assert('BR-AUTH-01.2: Token hash length is 64 hex characters', hash1.length === 64);

	// 3. E2E-03: RBAC Mutation Boundary Guards (FR-AUTH-04, FR-AUTH-05)
	assert(
		'FR-AUTH-04: Author cannot publish',
		!isRoleAllowed('author', ['editor', 'owner'])
	);
	assert(
		'FR-AUTH-04: Editor can publish',
		isRoleAllowed('editor', ['editor', 'owner'])
	);
	assert(
		'FR-AUTH-04: Owner can perform all administrative actions',
		isRoleAllowed('owner', ['owner']) && isRoleAllowed('owner', ['editor', 'owner'])
	);
	assert(
		'FR-AUTH-04: Viewer has read-only privileges',
		!isRoleAllowed('viewer', ['author', 'editor', 'owner'])
	);

	// 4. Rate Limiting Tests (FR-SYS-03, BR-AUTH-07.1)
	const testKey = `test_limit_${Date.now()}`;
	for (let i = 0; i < 5; i++) {
		const r = checkRateLimit({ key: testKey, limit: 5, windowMs: 10000 });
		assert(`Rate limiter iteration ${i + 1}`, r.success);
	}
	const blockedResult = checkRateLimit({ key: testKey, limit: 5, windowMs: 10000 });
	assert('FR-SYS-03: Rate limiter enforces limit boundary (exceed returns false)', !blockedResult.success);

	// 5. Database State & Seeding Verification (SI-01, FR-AUTH-09)
	const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
	if (!dbUrl) throw new Error('Database URL not set');
	const sql = neon(dbUrl);

	const ownerUsers = await sql`SELECT email, role, deactivated FROM users WHERE role = 'owner'`;
	assert('FR-AUTH-09: Initial Owner exists in Neon DB', ownerUsers.length >= 1 && ownerUsers[0].deactivated === false);

	const catCount = await sql`SELECT count(*) FROM categories`;
	assert('FR-CMS-15: Default categories seeded in Neon DB', parseInt(catCount[0].count, 10) >= 4);

	const publishedCount = await sql`SELECT count(*) FROM posts WHERE status = 'published'`;
	assert('FR-PUB-01: Published stories seeded in Neon DB', parseInt(publishedCount[0].count, 10) >= 4);

	// 6. Slug generation & Reserved slug handling (BR-CMS-05.1, BR-CMS-05.5)
	assert('BR-CMS-05.1: Slugify creates clean hyphenated slugs', slugify('Hello World! 2026 Test') === 'hello-world-2026-test');

	console.log(`\n=====================================================`);
	console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
	console.log(`=====================================================\n`);

	if (failed > 0) {
		process.exit(1);
	}
	process.exit(0);
}

runAcceptanceTests().catch((err) => {
	console.error('Test execution failed:', err);
	process.exit(1);
});
