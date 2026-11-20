import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server/app';
import { repository } from '../../server/db/repository';
import { AuthService } from '../../server/middleware/auth';
import { StorageService } from '../../server/services/storageService';
import { EmailService } from '../../server/services/emailService';
import { checkDatabaseHealth } from '../../server/db/index';
import { runMigrations } from '../../server/db/migrate';
import { provisionAdmin } from '../../scripts/provision-admin';
import path from 'path';
import fs from 'fs';

const app = createApp();

describe('AI Tathastu Insights — Phase 6: Production Infrastructure & Live Integration', () => {
  beforeEach(() => {
    // Clear outbound email logs before each test
    EmailService.clearLogs();
  });

  // =========================================================================
  // 1. POSTGRESQL / NEON INFRASTRUCTURE INTEGRATION
  // =========================================================================
  describe('PostgreSQL / Neon Infrastructure Integration', () => {
    it('reports database connectivity and diagnostic health accurately', async () => {
      const health = await checkDatabaseHealth();
      expect(health).toHaveProperty('isHealthy');
      expect(typeof health.isHealthy).toBe('boolean');
    });

    it('verifies Drizzle migration runner executes and safely checks migrations folder', async () => {
      const result = await runMigrations();
      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('message');
    });

    it('verifies all expected Drizzle migration files and SQL schemas exist on disk', () => {
      const drizzleDir = path.resolve(process.cwd(), 'drizzle');
      expect(fs.existsSync(drizzleDir)).toBe(true);
      const files = fs.readdirSync(drizzleDir);
      expect(files.some((f) => f.endsWith('.sql'))).toBe(true);
    });
  });

  // =========================================================================
  // 2. MEDIA STORAGE INTEGRATION (CLOUDINARY & LOCAL SECURE STORAGE)
  // =========================================================================
  describe('Media Storage & Cloudinary Integration', () => {
    it('reports Cloudinary diagnostic configuration state honestly', async () => {
      const diag = await StorageService.testCloudinaryConnection();
      expect(diag).toHaveProperty('configured');
      expect(diag).toHaveProperty('canUpload');
      expect(diag).toHaveProperty('message');
      // If credentials are placeholder or absent, configured must be false
      if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY.includes('YOUR_')) {
        expect(diag.configured).toBe(false);
      }
    });

    it('successfully uploads, hashes, and stores an authentic image with SHA256 integrity', async () => {
      const dummyPng = Buffer.from('89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C489', 'hex');
      const result = await StorageService.saveUploadedFile(dummyPng, 'product-screenshot.png', 'image/png', 'media');

      expect(result).toHaveProperty('fileUrl');
      expect(result).toHaveProperty('hashSha256');
      expect(result.sizeBytes).toBe(dummyPng.length);
      expect(result.mimeType).toBe('image/png');
      expect(['cloudinary', 'local_secure']).toContain(result.storageProvider);

      // Verify file deletion
      const deleted = await StorageService.deleteUploadedFile(result.fileUrl);
      expect(deleted).toBe(true);
    });

    it('handles video and document media formats within allowed limits', async () => {
      const dummyPdf = Buffer.from('%PDF-1.4\n%EOF\n');
      const result = await StorageService.saveUploadedFile(dummyPdf, 'research-whitepaper.pdf', 'application/pdf', 'manuscript');

      expect(result.mimeType).toBe('application/pdf');
      expect(result.originalName).toBe('research-whitepaper.pdf');
      expect(result.fileUrl).toMatch(/\.pdf$/);

      await StorageService.deleteUploadedFile(result.fileUrl);
    });

    it('rejects disallowed executable file types with strict security whitelist', async () => {
      const dangerousBuffer = Buffer.from('MZ\x90\x00\x03\x00\x00\x00');
      await expect(
        StorageService.saveUploadedFile(dangerousBuffer, 'exploit.exe', 'application/x-msdownload', 'media')
      ).rejects.toThrow(/Disallowed file type/);
    });
  });

  // =========================================================================
  // 3. AUTHENTICATION & SUPER ADMIN PROVISIONING SECURITY
  // =========================================================================
  describe('Authentication & Hardened Admin Provisioning', () => {
    it('strictly forbids passing passwords as plaintext CLI command-line arguments', async () => {
      const originalArgv = [...process.argv];
      process.argv = ['node', 'scripts/provision-admin.ts', '--email=admin@tathastu-insights.org', '--password=InsecurePassword123!'];

      try {
        await expect(provisionAdmin()).rejects.toThrow(/SECURITY_ERROR_PLAINTEXT_CLI_PASSWORD_PROHIBITED/);
      } finally {
        process.argv = originalArgv;
      }
    });

    it('provisions Super Admin securely when password is provided via environment variable', async () => {
      const originalEnv = process.env.ADMIN_PASSWORD;
      process.env.ADMIN_PASSWORD = 'StrongFrontierAdmin2026!#';

      await provisionAdmin();

      const adminUser = Array.from(repository.users.values()).find(
        (u) => u.email === 'admin@tathastu-insights.org'
      );

      expect(adminUser).toBeDefined();
      expect(adminUser?.roleId).toBe('super_admin');
      expect(adminUser?.passwordHash).toMatch(/^\$2[aby]\$12\$/); // Verified 12 salt rounds

      process.env.ADMIN_PASSWORD = originalEnv;
    });

    it('authenticates Super Admin, issues JWT, and revokes session on logout', async () => {
      // 1. Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@tathastu-insights.org',
          password: 'StrongFrontierAdmin2026!#',
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body).toHaveProperty('token');
      const token = loginRes.body.token;

      // 2. Verify authenticated access with token
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(meRes.status).toBe(200);
      expect(meRes.body.user.roleId).toBe('super_admin');

      // 3. Logout
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);
      expect(logoutRes.status).toBe(200);

      // 4. Token must now be rejected due to session revocation
      const postLogoutRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(postLogoutRes.status).toBe(401);
    });
  });

  // =========================================================================
  // 4. ALL SEVEN ROLES (RBAC) API ROUTE AUTHORIZATION MATRIX
  // =========================================================================
  describe('RBAC Authorization Matrix — All 7 Roles Tested Directly at API Routes', () => {
    const roles: Array<{ roleId: string; email: string }> = [
      { roleId: 'super_admin', email: 'admin@tathastu-insights.org' },
      { roleId: 'admin', email: 'admin-desk@tathastu-insights.org' },
      { roleId: 'editor', email: 'editor@tathastu-insights.org' },
      { roleId: 'research_editor', email: 'reviewer@tathastu-insights.org' },
      { roleId: 'media_manager', email: 'media@tathastu-insights.org' },
      { roleId: 'author', email: 'author@institution.edu' },
      { roleId: 'contributor', email: 'contributor@community.org' },
    ];

    it('verifies all 7 roles exist in the system registry', () => {
      roles.forEach((r) => {
        const user = Array.from(repository.users.values()).find((u) => u.email === r.email);
        expect(user).toBeDefined();
        expect(user?.roleId).toBe(r.roleId);
      });
    });

    it('allows Super Admin full access to administrative user creation', async () => {
      const superAdminToken = AuthService.signToken({
        id: 'usr-admin-01',
        email: 'admin@tathastu-insights.org',
        name: 'Dr. Aravind Nair',
        roleId: 'super_admin',
      });

      const res = await request(app)
        .post('/api/studio/users')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          email: `new-user-${Date.now()}@tathastu-insights.org`,
          name: 'New Staff Member',
          roleId: 'editor',
          affiliation: 'Editorial Board',
        });

      expect(res.status).toBe(201);
    });

    it('strictly forbids Author and Contributor from creating or modifying users (403 Forbidden)', async () => {
      const authorToken = AuthService.signToken({
        id: 'usr-author-01',
        email: 'author@institution.edu',
        name: 'Dr. Elena Rostova',
        roleId: 'author',
      });

      const authorRes = await request(app)
        .post('/api/studio/users')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ email: 'hack@tathastu.org', name: 'Unauthorized', roleId: 'admin' });
      expect(authorRes.status).toBe(403);

      const contributorToken = AuthService.signToken({
        id: 'usr-contrib-01',
        email: 'contributor@community.org',
        name: 'Arun Kumar',
        roleId: 'contributor',
      });

      const contribRes = await request(app)
        .post('/api/studio/users')
        .set('Authorization', `Bearer ${contributorToken}`)
        .send({ email: 'hack2@tathastu.org', name: 'Unauthorized', roleId: 'admin' });
      expect(contribRes.status).toBe(403);
    });

    it('allows Media Manager to upload media assets but forbids them from publishing products', async () => {
      const mediaManagerToken = AuthService.signToken({
        id: 'usr-media-01',
        email: 'media@tathastu-insights.org',
        name: 'Maya Sen',
        roleId: 'media_manager',
      });

      // Allowed: Create Media Asset
      const mediaRes = await request(app)
        .post('/api/studio/media')
        .set('Authorization', `Bearer ${mediaManagerToken}`)
        .send({
          title: 'Aegis Architecture Diagram',
          fileUrl: '/uploads/media/aegis.png',
          format: 'png',
          sizeBytes: 1024,
        });
      expect(mediaRes.status).toBe(201);

      // Forbidden: Publish Product
      const publishRes = await request(app)
        .patch('/api/studio/products/collaborate/publish')
        .set('Authorization', `Bearer ${mediaManagerToken}`);
      expect(publishRes.status).toBe(403);
    });

    it('allows Editor to review manuscripts and products, but forbids Contributor', async () => {
      const editorToken = AuthService.signToken({
        id: 'usr-editor-01',
        email: 'editor@tathastu-insights.org',
        name: 'Prof. Clara Zheng',
        roleId: 'editor',
      });

      const reviewRes = await request(app)
        .patch('/api/editorial/submissions/sub-2026-0842/status')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({ status: 'approved', notes: 'Commencing formal double-blind peer audit' });
      expect(reviewRes.status).toBe(200);

      const contributorToken = AuthService.signToken({
        id: 'usr-contrib-01',
        email: 'contributor@community.org',
        name: 'Arun Kumar',
        roleId: 'contributor',
      });

      const contribRes = await request(app)
        .patch('/api/editorial/submissions/sub-2026-0842/status')
        .set('Authorization', `Bearer ${contributorToken}`)
        .send({ status: 'approved' });
      expect(contribRes.status).toBe(403);
    });
  });

  // =========================================================================
  // 5. TRANSACTIONAL EMAIL INTEGRATION
  // =========================================================================
  describe('Transactional Email Integration', () => {
    it('reports provider connection status accurately', async () => {
      const providerHealth = await EmailService.verifyProviderConnection();
      expect(providerHealth).toHaveProperty('configured');
      expect(providerHealth).toHaveProperty('provider');
      expect(providerHealth).toHaveProperty('canDeliver');
    });

    it('triggers and records transactional password reset email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'admin@tathastu-insights.org' });

      expect(res.status).toBe(200);
      const logs = EmailService.getOutboundLogs();
      expect(logs.some((l) => l.template === 'password_reset' && l.to === 'admin@tathastu-insights.org')).toBe(true);
    });

    it('triggers and records newsletter double opt-in confirmation email', async () => {
      const testEmail = `subscriber-${Date.now()}@oxford.edu`;
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: testEmail, consent: true });

      expect(res.status).toBe(201);
      const logs = EmailService.getOutboundLogs();
      expect(logs.some((l) => l.template === 'newsletter_confirmation' && l.to === testEmail)).toBe(true);
    });

    it('triggers and records editorial decision notification email on status update', async () => {
      const ms = repository.manuscripts.get('sub-2026-0842');
      if (ms) {
        ms.status = 'in_review';
        repository.manuscripts.set('sub-2026-0842', ms);
      }

      const editorToken = AuthService.signToken({
        id: 'usr-editor-01',
        email: 'editor@tathastu-insights.org',
        name: 'Prof. Clara Zheng',
        roleId: 'editor',
      });

      const res = await request(app)
        .patch('/api/editorial/submissions/sub-2026-0842/status')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({ status: 'revision_requested', notes: 'Please provide benchmark source code reproduction.' });

      expect(res.status).toBe(200);
      const logs = EmailService.getOutboundLogs();
      expect(logs.some((l) => l.template === 'editorial_notification')).toBe(true);
    });

    it('triggers and records subscription unsubscribe receipt email', async () => {
      const email = 'researcher@oxford.ac.uk';
      // First ensure the email is registered
      await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email, consent: true });

      const res = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email });

      expect(res.status).toBe(200);
      const logs = EmailService.getOutboundLogs();
      expect(logs.some((l) => l.template === 'unsubscribe_confirmation' && l.to === email)).toBe(true);
    });
  });

  // =========================================================================
  // 6. COMPLETE 12-STEP PRODUCTION VALIDATION WORKFLOW
  // =========================================================================
  describe('Complete 12-Step Production Validation Workflow', () => {
    const testProductId = `prod-audit-${Date.now()}`;
    const testProductSlug = `audit-engine-${Date.now()}`;
    let superAdminToken: string;
    let editorToken: string;
    let screenshotUrl: string;

    // Step 1: Super Admin logs in
    it('Step 1: Super Admin logs in and receives verified session JWT', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@tathastu-insights.org',
          password: 'StrongFrontierAdmin2026!#',
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body).toHaveProperty('token');
      superAdminToken = loginRes.body.token;

      // Also generate editor token for the review step
      editorToken = AuthService.signToken({
        id: 'usr-editor-01',
        email: 'editor@tathastu-insights.org',
        name: 'Prof. Clara Zheng',
        roleId: 'editor',
      });
    });

    // Step 2: Admin creates a product
    it('Step 2: Admin creates a product record in the Studio', async () => {
      const res = await request(app)
        .post('/api/studio/products')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: testProductId,
          slug: testProductSlug,
          name: 'Frontier Verification Engine',
          tagline: 'Cryptographic Determinism for Autonomous Agents',
          shortDescription: 'Verifiable audit ledger and state validation runtime.',
          fullDescription: 'Comprehensive technical architecture verifying model determinism across distributed nodes.',
          status: 'Prototype',
          provenanceLabel: 'Functional Demonstration',
          version: '0.1.0',
          accentColor: 'indigo',
          isPublished: false,
          editorialStatus: 'draft',
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe(testProductId);
      expect(res.body.isPublished).toBe(false);
      expect(res.body.editorialStatus).toBe('draft');
    });

    // Step 3: Admin uploads its actual screenshot
    it('Step 3: Admin uploads actual product screenshot through the Media Service', async () => {
      const imageBuffer = Buffer.from('89504E470D0A1A0A0000000D494844520000000200000002080600000072B60D24', 'hex');
      const uploadRes = await request(app)
        .post('/api/studio/media/upload')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .attach('file', imageBuffer, 'frontier-engine-screenshot.png')
        .field('title', 'Frontier Verification Screenshot');

      expect(uploadRes.status).toBe(201);
      expect(uploadRes.body).toHaveProperty('upload');
      expect(uploadRes.body.upload).toHaveProperty('fileUrl');
      screenshotUrl = uploadRes.body.upload.fileUrl;
      expect(screenshotUrl.length).toBeGreaterThan(0);
    });

    // Step 4: Admin saves a draft with screenshot attached
    it('Step 4: Admin attaches screenshot and saves product as draft', async () => {
      const res = await request(app)
        .patch(`/api/studio/products/${testProductId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          coverImageUrl: screenshotUrl,
          screenshots: [screenshotUrl],
          editorialStatus: 'draft',
          isPublished: false,
        });

      expect(res.status).toBe(200);
      expect(res.body.coverImageUrl).toBe(screenshotUrl);
      expect(res.body.screenshots).toContain(screenshotUrl);
      expect(res.body.isPublished).toBe(false);
    });

    // Step 5: Editor reviews and approves it
    it('Step 5: Editor reviews draft and grants editorial approval', async () => {
      const res = await request(app)
        .patch(`/api/studio/products/${testProductId}/review`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          status: 'approved',
          notes: 'Technical claims verified against prototype codebase. Ready for publication.',
        });

      expect(res.status).toBe(200);
      expect(res.body.editorialStatus).toBe('approved');
      expect(res.body.approvedBy).toBe('usr-editor-01');
    });

    // Step 6: Admin publishes it
    it('Step 6: Admin publishes the approved product', async () => {
      const res = await request(app)
        .patch(`/api/studio/products/${testProductId}/publish`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.isPublished).toBe(true);
      expect(res.body.editorialStatus).toBe('published');
    });

    // Step 7: Product appears on the public website
    it('Step 7: Product appears on the public website endpoints', async () => {
      // 1. Appears in products directory
      const listRes = await request(app).get('/api/public/products');
      expect(listRes.status).toBe(200);
      const found = listRes.body.find((p: any) => p.id === testProductId);
      expect(found).toBeDefined();
      expect(found.name).toBe('Frontier Verification Engine');

      // 2. Appears on individual product route
      const singleRes = await request(app).get(`/api/public/products/${testProductSlug}`);
      expect(singleRes.status).toBe(200);
      expect(singleRes.body.id).toBe(testProductId);
    });

    // Step 8: Admin edits the product
    it('Step 8: Admin updates product content and increments version', async () => {
      const res = await request(app)
        .patch(`/api/studio/products/${testProductId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          version: '0.2.0',
          tagline: 'Updated: Production Verification Kernel',
          shortDescription: 'Enhanced benchmark validation with Byzantine resistance.',
        });

      expect(res.status).toBe(200);
      expect(res.body.version).toBe('0.2.0');
      expect(res.body.tagline).toBe('Updated: Production Verification Kernel');
    });

    // Step 9: New version is saved and archived in version history
    it('Step 9: Version history archives previous state and reflects new version', async () => {
      const res = await request(app)
        .get(`/api/studio/products/${testProductId}/versions`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body.some((v: any) => v.version === '0.1.0')).toBe(true);
    });

    // Step 10: Admin unpublishes the product
    it('Step 10: Admin unpublishes the product', async () => {
      const res = await request(app)
        .patch(`/api/studio/products/${testProductId}/unpublish`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.isPublished).toBe(false);
      expect(res.body.editorialStatus).toBe('draft');
    });

    // Step 11: Product disappears from public pages
    it('Step 11: Unpublished product immediately disappears from public endpoints', async () => {
      // 1. Missing from public list
      const listRes = await request(app).get('/api/public/products');
      expect(listRes.status).toBe(200);
      const found = listRes.body.find((p: any) => p.id === testProductId);
      expect(found).toBeUndefined();

      // 2. Direct slug access returns 404
      const singleRes = await request(app).get(`/api/public/products/${testProductSlug}`);
      expect(singleRes.status).toBe(404);
    });

    // Step 12: All changes remain after a server restart
    it('Step 12: All changes, versions, and drafts survive simulated server restart', async () => {
      // Force disk persistence snapshot
      repository.persistToDisk();

      // Clear memory and reload from disk snapshot
      repository.loadFromDisk();

      // Verify the unpublished product, its versions, and its draft status remain intact
      const persisted = repository.getProductById(testProductId);
      expect(persisted).toBeDefined();
      expect(persisted?.isPublished).toBe(false);
      expect(persisted?.version).toBe('0.2.0');
      expect(persisted?.versions?.length).toBeGreaterThan(0);
      expect(persisted?.coverImageUrl).toBe(screenshotUrl);

      // Clean up test product
      repository.deleteProduct(testProductId);
    });
  });
});
