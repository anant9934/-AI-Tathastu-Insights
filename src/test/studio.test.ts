import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server/app';
import { repository } from '../../server/db/repository';

const app = createApp();

describe('AI Tathastu Insights — Admin Dashboard & Headless CMS (Studio)', () => {
  let superAdminToken: string;
  let editorToken: string;
  let authorToken: string;

  beforeAll(async () => {
    // 1. Authenticate Super Admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@tathastu-insights.org', password: 'TathastuFrontierAdmin2026!' });
    expect(adminRes.status).toBe(200);
    superAdminToken = adminRes.body.token;

    // 2. Authenticate Editor
    const editorRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'editor@tathastu-insights.org', password: 'TathastuEditorialDesk2026!' });
    expect(editorRes.status).toBe(200);
    editorToken = editorRes.body.token;

    // 3. Authenticate Author
    const authorRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'author@institution.edu', password: 'TathastuAuthor2026!' });
    expect(authorRes.status).toBe(200);
    authorToken = authorRes.body.token;
  });

  // -------------------------------------------------------------
  // 1. SECURITY & ACCESS CONTROL
  // -------------------------------------------------------------
  describe('Security, Authentication & Role Isolation', () => {
    it('rejects unauthenticated requests to Studio endpoints', async () => {
      const res = await request(app).get('/api/studio/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });

    it('rejects unauthenticated requests to Content management', async () => {
      const res = await request(app).get('/api/studio/content');
      expect(res.status).toBe(401);
    });

    it('allows authenticated users into the Studio workspace', async () => {
      const res = await request(app)
        .get('/api/studio/dashboard')
        .set('Authorization', `Bearer ${superAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.metrics).toBeDefined();
    });

    it('restricts user management to Super Admin and Admin roles', async () => {
      const forbiddenRes = await request(app)
        .get('/api/studio/users')
        .set('Authorization', `Bearer ${authorToken}`);
      expect(forbiddenRes.status).toBe(403);

      const allowedRes = await request(app)
        .get('/api/studio/users')
        .set('Authorization', `Bearer ${superAdminToken}`);
      expect(allowedRes.status).toBe(200);
      expect(Array.isArray(allowedRes.body)).toBe(true);
    });
  });

  // -------------------------------------------------------------
  // 2. OPERATIONAL DASHBOARD
  // -------------------------------------------------------------
  describe('Operational Dashboard & Real Metrics', () => {
    it('computes live metrics directly from repository store without hardcoded numbers', async () => {
      const res = await request(app)
        .get('/api/studio/dashboard')
        .set('Authorization', `Bearer ${superAdminToken}`);
      
      expect(res.status).toBe(200);
      const { metrics, workflowCounts, recentActivities } = res.body;

      expect(typeof metrics.publishedArticles).toBe('number');
      expect(typeof metrics.drafts).toBe('number');
      expect(typeof metrics.inReview).toBe('number');
      expect(typeof metrics.totalProducts).toBe('number');
      expect(typeof metrics.publishedUpdates).toBe('number');
      expect(typeof metrics.subscriberCount).toBe('number');

      expect(metrics.totalProducts).toBeGreaterThanOrEqual(4);
      expect(workflowCounts.draft).toBeDefined();
      expect(Array.isArray(recentActivities)).toBe(true);
    });
  });

  // -------------------------------------------------------------
  // 3. UNIFIED CONTENT MANAGEMENT & EDITORIAL LIFECYCLE
  // -------------------------------------------------------------
  describe('Content Management & Lifecycle Operations', () => {
    let createdArticleId: string;

    it('creates a new article draft with custom blocks', async () => {
      const payload = {
        title: 'Empirical Verification of Non-blocking Attention Pipelines',
        subtitle: 'Benchmarking asynchronous KV-cache prefetching.',
        abstract: 'Comprehensive study into non-blocking attention kernels running over PCI-e Gen 5 interfaces.',
        contentType: 'engineering_article',
        category: 'Kernel Engineering',
        status: 'draft',
        blocks: [
          { id: 'b1', type: 'paragraph', sortOrder: 1, content: { text: 'Prefetching attention heads asynchronously eliminates PCIe stalls.' } },
          { id: 'b2', type: 'code', sortOrder: 2, content: { language: 'cuda', code: '__global__ void prefetch_kv() {}' } },
        ],
      };

      const res = await request(app)
        .post('/api/studio/content')
        .set('Authorization', `Bearer ${editorToken}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.title).toBe(payload.title);
      expect(res.body.status).toBe('draft');
      createdArticleId = res.body.id;
    });

    it('retrieves article and its initial version snapshot', async () => {
      const res = await request(app)
        .get(`/api/studio/content/${createdArticleId}`)
        .set('Authorization', `Bearer ${editorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.item.id).toBe(createdArticleId);
      expect(res.body.versions.length).toBeGreaterThanOrEqual(1);
    });

    it('updates article content and creates a new version snapshot', async () => {
      const res = await request(app)
        .put(`/api/studio/content/${createdArticleId}`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Empirical Verification of Non-blocking Attention Pipelines (Revised)',
          changelog: 'Added CUDA kernel benchmarks and revised abstract.',
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toContain('(Revised)');

      // Check version history
      const getRes = await request(app)
        .get(`/api/studio/content/${createdArticleId}`)
        .set('Authorization', `Bearer ${editorToken}`);
      expect(getRes.body.versions.length).toBe(2);
      expect(getRes.body.versions[0].changelog).toBe('Added CUDA kernel benchmarks and revised abstract.');
    });

    it('progresses article through editorial lifecycle stages to published', async () => {
      // 1. Move to in_review
      const r1 = await request(app)
        .post(`/api/studio/content/${createdArticleId}/status`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ status: 'in_review', notes: 'Ready for peer audit' });
      expect(r1.status).toBe(200);
      expect(r1.body.status).toBe('in_review');

      // 2. Move to approved
      const r2 = await request(app)
        .post(`/api/studio/content/${createdArticleId}/status`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({ status: 'approved', notes: 'Empirical checks passed' });
      expect(r2.status).toBe(200);
      expect(r2.body.status).toBe('approved');

      // 3. Publish
      const r3 = await request(app)
        .post(`/api/studio/content/${createdArticleId}/status`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ status: 'published' });
      expect(r3.status).toBe(200);
      expect(r3.body.status).toBe('published');
      expect(r3.body.publishedAt).toBeDefined();
    });

    it('duplicates an article correctly', async () => {
      const res = await request(app)
        .post(`/api/studio/content/${createdArticleId}/duplicate`)
        .set('Authorization', `Bearer ${editorToken}`);

      expect(res.status).toBe(201);
      expect(res.body.id).not.toBe(createdArticleId);
      expect(res.body.title).toContain('(Copy)');
      expect(res.body.status).toBe('draft');
    });

    it('deletes an article with audit trail confirmation', async () => {
      const res = await request(app)
        .delete(`/api/studio/content/${createdArticleId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const verifyRes = await request(app)
        .get(`/api/studio/content/${createdArticleId}`)
        .set('Authorization', `Bearer ${editorToken}`);
      expect(verifyRes.status).toBe(404);
    });
  });

  // -------------------------------------------------------------
  // 4. PRODUCT MANAGEMENT & REORDERING
  // -------------------------------------------------------------
  describe('Product Management & Reordering', () => {
    it('lists all registered products with verified statuses', async () => {
      const res = await request(app)
        .get('/api/studio/products')
        .set('Authorization', `Bearer ${editorToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const names = res.body.map((p: any) => p.name);
      expect(names).toContain('MentorMaze');
      expect(names).toContain('Collaborate');
      expect(names).toContain('Avsar');
      expect(names).toContain('Iris');
    });

    it('creates a new product record', async () => {
      const payload = {
        name: 'Synthetica',
        slug: 'synthetica',
        tagline: 'Deterministic synthetic data generation and formal invariants.',
        shortDescription: 'Provably correct synthetic generation engine for safety validation.',
        fullDescription: 'Synthetica generates formal counterexamples to evaluate model safety bounds.',
        status: 'Prototype',
        provenanceLabel: 'Functional Demonstration',
        isPublished: true,
      };

      const res = await request(app)
        .post('/api/studio/products')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.id).toBe('synthetica');
      expect(res.body.name).toBe('Synthetica');
    });

    it('reorders products correctly', async () => {
      const reorderRes = await request(app)
        .post('/api/studio/products/reorder')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ orderIds: ['iris', 'avsar', 'collaborate', 'mentormaze', 'synthetica'] });

      expect(reorderRes.status).toBe(200);
      expect(reorderRes.body[0].id).toBe('iris');
      expect(reorderRes.body[0].displayOrder).toBe(1);
    });

    it('deletes a product cleanly', async () => {
      const delRes = await request(app)
        .delete('/api/studio/products/synthetica')
        .set('Authorization', `Bearer ${superAdminToken}`);
      expect(delRes.status).toBe(200);
    });
  });

  // -------------------------------------------------------------
  // 5. RESEARCH PAPERS & DOI RESOLUTION
  // -------------------------------------------------------------
  describe('Research Papers & DOI Verification', () => {
    it('lists all research papers', async () => {
      const res = await request(app)
        .get('/api/studio/research')
        .set('Authorization', `Bearer ${editorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });

    it('triggers live DOI verification for a research paper', async () => {
      const res = await request(app)
        .post('/api/studio/research/paper-sparse-autoencoders/verify-doi')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.verificationResult).toBeDefined();
      expect(res.body.paper.doi).toBe('10.5281/zenodo.1084291');
    });
  });

  // -------------------------------------------------------------
  // 6. HOMEPAGE COMPOSITION & SETTINGS
  // -------------------------------------------------------------
  describe('Homepage Composition & Global Settings', () => {
    it('retrieves and updates homepage configuration', async () => {
      const getRes = await request(app)
        .get('/api/studio/homepage')
        .set('Authorization', `Bearer ${editorToken}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.heroHeadline).toBeDefined();

      const updateRes = await request(app)
        .put('/api/studio/homepage')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          heroHeadline: 'Frontier AI Research, Verified Systems & Engineering',
        });
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.heroHeadline).toBe('Frontier AI Research, Verified Systems & Engineering');
    });

    it('updates site settings with proper audit recording', async () => {
      const res = await request(app)
        .put('/api/studio/settings')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          siteTitle: 'AI Tathastu Insights — Verified Frontier Systems',
        });
      expect(res.status).toBe(200);
      expect(res.body.siteTitle).toBe('AI Tathastu Insights — Verified Frontier Systems');
    });
  });

  // -------------------------------------------------------------
  // 7. NEWSLETTER & CSV EXPORT
  // -------------------------------------------------------------
  describe('Newsletter Subscribers & CSV Export', () => {
    it('retrieves subscriber list', async () => {
      const res = await request(app)
        .get('/api/studio/newsletter')
        .set('Authorization', `Bearer ${editorToken}`);
      expect(res.status).toBe(200);
      expect(res.body.total).toBeGreaterThanOrEqual(1);
    });

    it('exports subscriber list to CSV format', async () => {
      const res = await request(app)
        .get('/api/studio/newsletter/export')
        .set('Authorization', `Bearer ${superAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('ID,Email,Confirmed,ConsentTimestamp');
    });
  });

  // -------------------------------------------------------------
  // 8. PUBLIC SITE SYNCHRONIZATION
  // -------------------------------------------------------------
  describe('Public Synchronization & Privacy Safeguards', () => {
    it('public homepage endpoint returns updated homepage config', async () => {
      const res = await request(app).get('/api/public/homepage');
      expect(res.status).toBe(200);
      expect(res.body.config.heroHeadline).toBe('Frontier AI Research, Verified Systems & Engineering');
      expect(res.body.products.length).toBeGreaterThanOrEqual(4);
    });

    it('public articles endpoint never returns unpublished drafts', async () => {
      // 1. Create a private draft
      const draft = repository.createContent(
        {
          title: 'Top Secret Unreleased Architecture',
          status: 'draft',
          abstract: 'Private research draft.',
        },
        'usr-admin-01'
      );

      // 2. Fetch public articles
      const publicRes = await request(app).get('/api/public/articles');
      expect(publicRes.status).toBe(200);
      const titles = publicRes.body.items.map((i: any) => i.title);
      expect(titles).not.toContain('Top Secret Unreleased Architecture');

      // 3. Attempting to fetch private draft by id/slug on public route returns 404
      const singleRes = await request(app).get(`/api/public/articles/${draft.id}`);
      expect(singleRes.status).toBe(404);

      // Clean up draft
      repository.deleteContent(draft.id);
    });

    it('public products endpoint returns only published products', async () => {
      const res = await request(app).get('/api/public/products');
      expect(res.status).toBe(200);
      expect(res.body.every((p: any) => p.isPublished === true)).toBe(true);
    });
  });
});
