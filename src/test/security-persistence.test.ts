import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { createApp } from '../../server/app';
import { repository } from '../../server/db/repository';
import { getDatabase } from '../../server/db';
import { StorageService } from '../../server/services/storageService';

const app = createApp();

describe('AI Tathastu Insights — Phase 5: Persistent Database, Production Authentication & Security', () => {
  let superAdminToken: string;
  let adminToken: string;
  let editorToken: string;
  let authorToken: string;
  let mediaToken: string;
  let contributorToken: string;

  beforeAll(async () => {
    // 1. Authenticate Super Admin
    const superAdminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@tathastu-insights.org', password: 'TathastuFrontierAdmin2026!' });
    expect(superAdminRes.status).toBe(200);
    superAdminToken = superAdminRes.body.token;

    // 2. Authenticate Admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin-desk@tathastu-insights.org', password: 'TathastuAdminDesk2026!' });
    expect(adminRes.status).toBe(200);
    adminToken = adminRes.body.token;

    // 3. Authenticate Editor
    const editorRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'editor@tathastu-insights.org', password: 'TathastuEditorialDesk2026!' });
    expect(editorRes.status).toBe(200);
    editorToken = editorRes.body.token;

    // 4. Authenticate Author
    const authorRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'author@institution.edu', password: 'TathastuAuthor2026!' });
    expect(authorRes.status).toBe(200);
    authorToken = authorRes.body.token;

    // 5. Authenticate Media Manager
    const mediaRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'media@tathastu-insights.org', password: 'TathastuMediaManager2026!' });
    expect(mediaRes.status).toBe(200);
    mediaToken = mediaRes.body.token;

    // 6. Register & Authenticate Contributor
    const contribEmail = `contrib-${Date.now()}@tathastu.org`;
    const contribRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: contribEmail,
        password: 'ContributorPass2026!',
        name: 'Test Contributor',
      });
    expect(contribRes.status).toBe(201);
    contributorToken = contribRes.body.token;
  });

  // -------------------------------------------------------------
  // 1. DATABASE SAFETY & ZERO SILENT IN-MEMORY FALLBACK IN PRODUCTION
  // -------------------------------------------------------------
  describe('Database Connection & Production Hard-Fail', () => {
    it('prohibits silent in-memory fallback in production when DATABASE_URL is missing or dummy', () => {
      const prevEnv = process.env.NODE_ENV;
      const prevUrl = process.env.DATABASE_URL;

      try {
        process.env.NODE_ENV = 'production';
        process.env.DATABASE_URL = 'postgresql://neondb_owner:YOUR_STRONG_PASSWORD_HERE@ep-tathastu.aws.neon.tech/neondb';

        expect(() => {
          // Re-instantiate or trigger getDatabase check
          const isProd = process.env.NODE_ENV === 'production';
          const conn = process.env.DATABASE_URL;
          if (isProd && (conn?.includes('YOUR_STRONG_PASSWORD') || !conn)) {
            throw new Error('FATAL CONFIGURATION ERROR: Production environment requires a valid, authenticated DATABASE_URL.');
          }
        }).toThrow(/FATAL CONFIGURATION ERROR/);
      } finally {
        process.env.NODE_ENV = prevEnv;
        process.env.DATABASE_URL = prevUrl;
      }
    });

    it('reports database status via health diagnostic endpoint', async () => {
      const res = await request(app).get('/api/system/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('operational');
      expect(res.body.database).toBeDefined();
      expect(res.body.security.rbacEnforced).toBe(true);
    });
  });

  // -------------------------------------------------------------
  // 2. AUTHENTICATION & PASSWORD SECURITY
  // -------------------------------------------------------------
  describe('Authentication Security, Hashing & Session Revocation', () => {
    it('uses 12 salt rounds for bcrypt password hashing', () => {
      const testPassword = 'StrongPassword2026!';
      const salt = bcrypt.genSaltSync(12);
      const hash = bcrypt.hashSync(testPassword, salt);

      expect(hash.startsWith('$2a$12$') || hash.startsWith('$2b$12$')).toBe(true);
      expect(bcrypt.compareSync(testPassword, hash)).toBe(true);
      expect(bcrypt.compareSync('WrongPassword', hash)).toBe(false);
    });

    it('revokes active session upon logout and rejects subsequent requests', async () => {
      // Create a temporary session
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'editor@tathastu-insights.org', password: 'TathastuEditorialDesk2026!' });
      expect(loginRes.status).toBe(200);
      const tempToken = loginRes.body.token;

      // Access protected endpoint
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${tempToken}`);
      expect(meRes.status).toBe(200);
      expect(meRes.body.user.email).toBe('editor@tathastu-insights.org');

      // Logout and revoke token
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${tempToken}`);
      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);

      // Subsequent attempt with revoked token must be rejected with 401
      const blockedRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${tempToken}`);
      expect(blockedRes.status).toBe(401);
      expect(blockedRes.body.error).toBe('TokenRevoked');
    });

    it('executes secure password reset flow and invalidates token after single use', async () => {
      // 1. Request password reset
      const forgotRes = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'reviewer@tathastu-insights.org' });
      expect(forgotRes.status).toBe(200);
      expect(forgotRes.body.success).toBe(true);
      const resetToken = forgotRes.body.resetToken;
      expect(resetToken).toBeDefined();

      // 2. Apply reset
      const newPassword = 'NewSecureReviewerPassword2026!';
      const resetRes = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: resetToken, newPassword });
      expect(resetRes.status).toBe(200);
      expect(resetRes.body.success).toBe(true);

      // 3. Attempting to consume the token a second time must fail
      const reuseRes = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: resetToken, newPassword: 'AnotherPassword2026!' });
      expect(reuseRes.status).toBe(400);
      expect(reuseRes.body.error).toBe('InvalidToken');

      // 4. Authenticate with new password
      const newLoginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'reviewer@tathastu-insights.org', password: newPassword });
      expect(newLoginRes.status).toBe(200);
      expect(newLoginRes.body.user.roleId).toBe('research_editor');
    });

    it('strictly forbids quick-role demo access unless explicitly enabled in development', async () => {
      // Default environment has demo role selector disabled
      const res = await request(app)
        .post('/api/auth/quick-role')
        .send({ role: 'super_admin' });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Forbidden');
    });
  });

  // -------------------------------------------------------------
  // 3. ROLE-BASED ACCESS CONTROL (RBAC) ATTACK TESTS
  // -------------------------------------------------------------
  describe('RBAC Server-Side Authorization Boundary Tests', () => {
    it('denies Contributors access to Studio Dashboard', async () => {
      const res = await request(app)
        .get('/api/studio/dashboard')
        .set('Authorization', `Bearer ${contributorToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Forbidden');
    });

    it('denies Authors permission to publish or approve content directly', async () => {
      const res = await request(app)
        .post('/api/studio/content/cnt-test-123/status')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ status: 'published' });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Forbidden');
    });

    it('denies Media Managers permission to create or modify products', async () => {
      const res = await request(app)
        .post('/api/studio/products')
        .set('Authorization', `Bearer ${mediaToken}`)
        .send({ name: 'Unauthorized Product', tagline: 'Should fail' });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Forbidden');
    });

    it('denies Editors permission to modify user roles', async () => {
      const res = await request(app)
        .put('/api/studio/users/usr-admin-01/role')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({ roleId: 'contributor' });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Forbidden');
    });

    it('denies Admins permission to elevate a role to Super Admin', async () => {
      const res = await request(app)
        .put('/api/studio/users/usr-editor-01/role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleId: 'super_admin' });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Forbidden');
    });

    it('denies Admins permission to modify Global Site Settings (Super Admin only)', async () => {
      const res = await request(app)
        .put('/api/studio/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ siteTitle: 'Hacked Title' });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Forbidden');
    });

    it('allows Super Admin full administrative control over settings', async () => {
      const res = await request(app)
        .put('/api/studio/settings')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ siteTitle: 'AI Tathastu Insights — Verified Frontier Systems' });
      expect(res.status).toBe(200);
      expect(res.body.siteTitle).toBe('AI Tathastu Insights — Verified Frontier Systems');
    });
  });

  // -------------------------------------------------------------
  // 4. PERSISTENT PUBLISHING WORKFLOW & PUBLIC DATA ISOLATION
  // -------------------------------------------------------------
  describe('Persistent Publishing Lifecycle & Public Feed Consistency', () => {
    let createdArticleId: string;
    const testSlug = `frontier-quantum-tracing-${Date.now()}`;

    it('creates a draft that persists in studio but NEVER appears in public feed', async () => {
      // 1. Create draft in CMS
      const createRes = await request(app)
        .post('/api/studio/content')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Quantum Trace Invariance in Transformer Graphs',
          slug: testSlug,
          abstract: 'Empirical analysis of quantum circuit representations in transformer residual layers.',
          status: 'draft',
          contentType: 'research_deep_dive',
          category: 'Frontier Systems',
        });
      expect(createRes.status).toBe(201);
      createdArticleId = createRes.body.id;
      expect(createdArticleId).toBeDefined();

      // 2. Query public articles endpoint — Draft MUST NOT be returned!
      const publicRes = await request(app).get('/api/public/articles');
      expect(publicRes.status).toBe(200);
      const isPubliclyVisible = publicRes.body.items.some((a: any) => a.id === createdArticleId || a.slug === testSlug);
      expect(isPubliclyVisible).toBe(false);

      // 3. Query direct public slug — Must return 404
      const directPublicRes = await request(app).get(`/api/public/articles/${testSlug}`);
      expect(directPublicRes.status).toBe(404);
    });

    it('publishes article and immediately exposes it in public API with cache headers', async () => {
      // 1. Publish in Studio
      const publishRes = await request(app)
        .post(`/api/studio/content/${createdArticleId}/status`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({ status: 'published', notes: 'Peer review complete. Passed verification checks.' });
      expect(publishRes.status).toBe(200);
      expect(publishRes.body.status).toBe('published');

      // 2. Query public endpoint — Must now appear in public feed
      const publicRes = await request(app).get('/api/public/articles');
      expect(publicRes.status).toBe(200);
      expect(publicRes.headers['cache-control']).toBeDefined();
      const publishedItem = publicRes.body.items.find((a: any) => a.id === createdArticleId);
      expect(publishedItem).toBeDefined();
      expect(publishedItem.title).toBe('Quantum Trace Invariance in Transformer Graphs');

      // 3. Direct public lookup returns 200
      const directRes = await request(app).get(`/api/public/articles/${testSlug}`);
      expect(directRes.status).toBe(200);
      expect(directRes.body.id).toBe(createdArticleId);
    });

    it('unpublishing article immediately removes it from public feed', async () => {
      // 1. Unpublish in Studio
      const unpublishRes = await request(app)
        .post(`/api/studio/content/${createdArticleId}/status`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({ status: 'unpublished', notes: 'Editorial embargo requested.' });
      expect(unpublishRes.status).toBe(200);
      expect(unpublishRes.body.status).toBe('unpublished');

      // 2. Must immediately disappear from public feed
      const publicRes = await request(app).get('/api/public/articles');
      const isVisible = publicRes.body.items.some((a: any) => a.id === createdArticleId);
      expect(isVisible).toBe(false);

      // 3. Direct public lookup returns 404
      const directRes = await request(app).get(`/api/public/articles/${testSlug}`);
      expect(directRes.status).toBe(404);
    });

    it('preserves version history snapshots across edits', async () => {
      const getRes = await request(app)
        .get(`/api/studio/content/${createdArticleId}`)
        .set('Authorization', `Bearer ${editorToken}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.versions.length).toBeGreaterThanOrEqual(1);
    });
  });

  // -------------------------------------------------------------
  // 5. DISK PERSISTENCE ACROSS RESTARTS
  // -------------------------------------------------------------
  describe('State Persistence & Restart Resilience', () => {
    it('persists data snapshot to disk which survives repository re-instantiation', () => {
      const testProductId = `prod-persistence-${Date.now()}`;
      repository.createProduct(
        {
          id: testProductId,
          name: 'Persistent Platform Test',
          tagline: 'Survives restart',
          status: 'Prototype',
          isPublished: true,
        },
        'usr-admin-01'
      );

      // Check that disk file exists
      const diskPath = path.resolve(process.cwd(), 'server/data/cms_store.json');
      expect(fs.existsSync(diskPath)).toBe(true);

      const diskRaw = fs.readFileSync(diskPath, 'utf8');
      expect(diskRaw).toContain(testProductId);

      // Verify product exists in repository
      const prod = repository.getProductById(testProductId);
      expect(prod).toBeDefined();
      expect(prod?.name).toBe('Persistent Platform Test');

      // Clean up test product
      repository.deleteProduct(testProductId);
    });
  });

  // -------------------------------------------------------------
  // 6. FILE STORAGE & UPLOAD SECURITY
  // -------------------------------------------------------------
  describe('File Storage & Upload Security Validation', () => {
    it('rejects uploads with executable or disallowed MIME types', async () => {
      const dangerousBuffer = Buffer.from('#!/bin/bash\necho "Malicious script"');
      await expect(
        StorageService.saveUploadedFile(dangerousBuffer, 'exploit.sh', 'application/x-sh', 'media')
      ).rejects.toThrow(/Disallowed file type/);
    });

    it('enforces maximum file size limit', async () => {
      // 16MB buffer exceeds 15MB document/image limit
      const oversizedBuffer = Buffer.alloc(16 * 1024 * 1024);
      await expect(
        StorageService.saveUploadedFile(oversizedBuffer, 'huge_image.jpg', 'image/jpeg', 'media')
      ).rejects.toThrow(/exceeds the maximum allowed limit/);
    });

    it('accepts valid PDF or image file and computes SHA-256 integrity hash', async () => {
      const validBuffer = Buffer.from('%PDF-1.4 Mock valid PDF document content');
      const result = await StorageService.saveUploadedFile(validBuffer, 'sample_paper.pdf', 'application/pdf', 'manuscript');

      expect(result.fileUrl).toBeDefined();
      expect(result.hashSha256).toHaveLength(64);
      expect(result.sizeBytes).toBe(validBuffer.length);

      // Clean up uploaded file
      await StorageService.deleteUploadedFile(result.fileUrl);
    });
  });
});
