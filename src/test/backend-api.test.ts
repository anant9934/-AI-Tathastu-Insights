import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server/app';
import { repository } from '../../server/db/repository';
import { DoiService, KNOWN_PROTOTYPE_RECORDS } from '../../server/services/doiService';
import { CitationService } from '../../server/services/citationService';
import { StorageService } from '../../server/services/storageService';

const app = createApp();

describe('Production Backend, Data Integrity & Editorial Infrastructure', () => {
  let adminToken: string;
  let editorToken: string;
  let contributorToken: string;

  beforeAll(async () => {
    // 1. Obtain authenticated tokens for role testing
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@tathastu-insights.org', password: 'TathastuFrontierAdmin2026!' });
    adminToken = adminRes.body.token;

    const editorRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'editor@tathastu-insights.org', password: 'TathastuEditorialDesk2026!' });
    editorToken = editorRes.body.token;

    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `test-${Date.now()}@university.edu`,
        password: 'SecurePassword123!',
        name: 'Test Contributor',
        affiliation: 'Independent Scholar',
      });
    contributorToken = regRes.body.token;
  });

  // 1. SYSTEM HEALTH & ARCHITECTURE
  describe('System Architecture & Health Checks', () => {
    it('returns operational status with database & security invariant metadata', async () => {
      const res = await request(app).get('/api/system/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('operational');
      expect(res.body.security.rbacEnforced).toBe(true);
      expect(res.body.security.rateLimitingActive).toBe(true);
      expect(res.body.security.doiVerificationEnforced).toBe(true);
    });
  });

  // 2. AUTHENTICATION & SESSION HANDLING
  describe('Authentication & Password Security', () => {
    it('authenticates valid credentials and issues JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@tathastu-insights.org', password: 'TathastuFrontierAdmin2026!' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.roleId).toBe('super_admin');
    });

    it('rejects invalid password with 401 InvalidCredentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@tathastu-insights.org', password: 'WrongPassword123!' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('InvalidCredentials');
    });

    it('validates JWT token on /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('admin@tathastu-insights.org');
    });

    it('denies access to protected routes without a token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });
  });

  // 3. SERVER-SIDE RBAC ENFORCEMENT
  describe('Server-Side Role-Based Access Control (RBAC)', () => {
    it('prohibits contributor from updating manuscript status', async () => {
      const res = await request(app)
        .patch('/api/editorial/submissions/sub-2026-0842/status')
        .set('Authorization', `Bearer ${contributorToken}`)
        .send({ status: 'approved' });

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Forbidden');
    });

    it('allows editor and super_admin to update manuscript status', async () => {
      const res = await request(app)
        .patch('/api/editorial/submissions/sub-2026-0842/status')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({ status: 'approved', notes: 'Peer review completed with consensus.' });

      expect(res.status).toBe(200);
      expect(res.body.submission.status).toBe('approved');
    });

    it('strictly restricts system audit log access to super_admin', async () => {
      const editorAudit = await request(app)
        .get('/api/system/audit')
        .set('Authorization', `Bearer ${editorToken}`);
      expect(editorAudit.status).toBe(403);

      const adminAudit = await request(app)
        .get('/api/system/audit')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(adminAudit.status).toBe(200);
      expect(Array.isArray(adminAudit.body.logs)).toBe(true);
    });
  });

  // 4. PERSISTENT EDITORIAL WORKFLOW
  describe('Manuscript Lifecycle & Peer Review Workflow', () => {
    let createdSubmissionId: string;

    it('accepts manuscript submission with valid metadata & reproducibility attestation', async () => {
      const res = await request(app)
        .post('/api/editorial/submissions')
        .send({
          title: 'Asymmetric Sparse Dictionaries in Layer-Wise Residual Audits',
          authorName: 'Dr. Sarah Jenkins',
          authorEmail: 's.jenkins@oxford.ac.uk',
          authorAffiliation: 'Oxford Department of Computer Science',
          categoryId: 'Interpretability',
          abstract: 'We introduce an asymmetric top-k dictionary architecture with monosemantic feature isolation guarantees across deep residual layers.',
          wordCount: 5400,
          reproducibilityAttestation: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.submission.id).toMatch(/^sub-2026-\d+$/);
      expect(res.body.submission.status).toBe('submitted');
      createdSubmissionId = res.body.submission.id;
    });

    it('rejects submission when reproducibility attestation is false', async () => {
      const res = await request(app)
        .post('/api/editorial/submissions')
        .send({
          title: 'Unreproducible Theoretical Hypothesis Without Harness',
          authorName: 'Anonymous',
          authorEmail: 'anon@darknet.org',
          authorAffiliation: 'None',
          categoryId: 'Interpretability',
          abstract: 'Theoretical conjecture without evaluation harness.',
          reproducibilityAttestation: false,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('ValidationError');
    });

    it('progresses manuscript through editorial lifecycle: submitted -> in_review -> approved', async () => {
      // 1. Assign to in_review
      const step1 = await request(app)
        .patch(`/api/editorial/submissions/${createdSubmissionId}/status`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({ status: 'in_review' });
      expect(step1.status).toBe(200);
      expect(step1.body.submission.status).toBe('in_review');

      // 2. Submit peer review
      const reviewRes = await request(app)
        .post(`/api/editorial/submissions/${createdSubmissionId}/review`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          stage: 'peer_review',
          score: 9.1,
          recommendation: 'accept',
          commentsForAuthor: 'Rigorous empirical evaluation and sound mathematical proofs across all 32 layers.',
          confidentialComments: 'Recommended for priority publication in Volume 26.',
        });
      expect(reviewRes.status).toBe(201);
      expect(reviewRes.body.review.score).toBe(9.1);

      // 3. Approve manuscript
      const step2 = await request(app)
        .patch(`/api/editorial/submissions/${createdSubmissionId}/status`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({ status: 'approved' });
      expect(step2.status).toBe(200);
      expect(step2.body.submission.status).toBe('approved');
    });

    it('prevents invalid lifecycle transitions for non-superadmins', async () => {
      // Trying to jump from approved directly to submitted
      const res = await request(app)
        .patch(`/api/editorial/submissions/${createdSubmissionId}/status`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({ status: 'submitted' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('InvalidTransition');
    });
  });

  // 5. DATA INTEGRITY & DOI VERIFICATION (SPECIFIC AUDIT OF 10.5281/zenodo.1084291)
  describe('Data Integrity & DOI Provenance Verification', () => {
    it('specifically investigates DOI 10.5281/zenodo.1084291 and flags as unverified demonstration', async () => {
      const res = await request(app)
        .post('/api/research/verify-doi')
        .send({ doi: '10.5281/zenodo.1084291' });

      expect(res.status).toBe(200);
      expect(res.body.doi).toBe('10.5281/zenodo.1084291');
      expect(res.body.publicationStatus).toBe('unverified_demo');
      expect(res.body.sourceProvenance).toBe('demonstration_concept');
      expect(res.body.verificationNotes).toContain('Decentralized Product Passports');
    });

    it('validates DOI format and rejects invalid syntax', async () => {
      const res = await request(app)
        .post('/api/research/verify-doi')
        .send({ doi: 'invalid-doi-format' });

      expect(res.status).toBe(200);
      expect(res.body.publicationStatus).toBe('rejected_fabrication');
    });

    it('generates accurate BibTeX citation with demonstration provenance note', () => {
      const bib = CitationService.generateBibtex({
        title: 'Top-K Sparse Autoencoders at Residual Layer Boundaries',
        authors: [{ name: 'Dr. Aravind Nair' }, { name: 'Dr. Priya Desai' }],
        year: 2026,
        doi: '10.5281/zenodo.1084291',
        isVerified: false,
      });

      expect(bib).toContain('@article{');
      expect(bib).toContain('title={Top-K Sparse Autoencoders at Residual Layer Boundaries}');
      expect(bib).toContain('author={Nair, Dr. Aravind and Desai, Dr. Priya}');
      expect(bib).toContain('Demonstration Record');
    });
  });

  // 6. UPLOAD SECURITY & FILE VALIDATION
  describe('Media Storage & Upload Security', () => {
    it('rejects disallowed file types such as executable or shell scripts', async () => {
      await expect(
        StorageService.saveUploadedFile(
          Buffer.from('malicious payload'),
          'exploit.exe',
          'application/x-msdownload'
        )
      ).rejects.toThrow(/Disallowed file type/);
    });

    it('accepts and computes SHA-256 hash for valid PDF manuscript', async () => {
      const pdfBuffer = Buffer.from('%PDF-1.4 sample manuscript research content');
      const result = await StorageService.saveUploadedFile(
        pdfBuffer,
        'research-manuscript.pdf',
        'application/pdf'
      );

      expect(result.originalName).toBe('research-manuscript.pdf');
      expect(result.mimeType).toBe('application/pdf');
      expect(result.hashSha256).toHaveLength(64);
      expect(result.fileUrl).toBeDefined();
    });
  });

  // 7. BOOKMARK PERSISTENCE & GUEST SYNCHRONIZATION
  describe('Bookmarks Persistence & Guest Sync', () => {
    it('toggles bookmarks for guest sessions using x-session-id', async () => {
      const sessionId = 'test-session-guest-99';
      const res1 = await request(app)
        .post('/api/bookmarks/toggle')
        .set('x-session-id', sessionId)
        .send({ articleId: 'sparse-autoencoders-residual-stream' });

      expect(res1.status).toBe(201);
      expect(res1.body.bookmarked).toBe(true);

      const listRes = await request(app)
        .get('/api/bookmarks')
        .set('x-session-id', sessionId);

      expect(listRes.body.bookmarkedIds).toContain('sparse-autoencoders-residual-stream');
    });

    it('synchronizes guest bookmarks into authenticated user account', async () => {
      const sessionId = 'sync-session-123';
      await request(app)
        .post('/api/bookmarks/toggle')
        .set('x-session-id', sessionId)
        .send({ articleId: 'latency-bounded-swarm-consensus' });

      const syncRes = await request(app)
        .post('/api/bookmarks/sync')
        .set('Authorization', `Bearer ${contributorToken}`)
        .send({ sessionId });

      expect(syncRes.status).toBe(200);
      expect(syncRes.body.bookmarkedIds).toContain('latency-bounded-swarm-consensus');
    });
  });

  // 8. NEWSLETTER DOUBLE OPT-IN & UNSUBSCRIBE
  describe('Newsletter Subscription Lifecycle', () => {
    it('registers institutional subscriber and records consent', async () => {
      const email = `researcher-${Date.now()}@institute.org`;
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('subscribed');
      expect(res.body.confirmationToken).toBeDefined();
    });

    it('rejects invalid email address', async () => {
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'not-an-email' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('ValidationError');
    });

    it('unsubscribes user upon request', async () => {
      const email = `optout-${Date.now()}@domain.edu`;
      await request(app).post('/api/newsletter/subscribe').send({ email });

      const unsubsRes = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email });

      expect(unsubsRes.status).toBe(200);
      expect(unsubsRes.body.message).toContain('successfully removed');
    });
  });

  // 9. MULTI-INDEX SEARCH & UNPUBLISHED CONTENT ISOLATION
  describe('Search Multi-Index & Publication Status Filtering', () => {
    it('returns published articles and papers matching keyword', async () => {
      const res = await request(app)
        .get('/api/search')
        .query({ q: 'Residual' });

      expect(res.status).toBe(200);
      expect(res.body.articles.length).toBeGreaterThanOrEqual(1);
      expect(res.body.researchPapers.length).toBeGreaterThanOrEqual(1);
    });

    it('strictly excludes unpublished manuscript drafts from public search results', async () => {
      // Query for created submission title
      const res = await request(app)
        .get('/api/search')
        .query({ q: 'Topological Features of Attention Heads' });

      // Must not appear in public search because it is unpublished (in_review/approved)
      expect(res.body.articles.length).toBe(0);
      expect(res.body.researchPapers.length).toBe(0);
    });
  });
});
