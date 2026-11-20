import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { createApp } from '../../server/app';
import { AUTHENTIC_MEDIA_REGISTRY, getProductAuthenticMedia } from '../lib/mediaAssets';

describe('Phase 7: Domain Architecture, Canonical Redirections & Authentic Media Verification', () => {
  const app = createApp();

  describe('Part A: Domain Architecture & Permanent 301 Redirection', () => {
    it('redirects secondary apex domain aitathastu.com to https://aitathastu.info with 301 status', async () => {
      const res = await request(app)
        .get('/products/collaborate?ref=docs')
        .set('Host', 'aitathastu.com');

      expect(res.status).toBe(301);
      expect(res.header.location).toBe('https://aitathastu.info/products/collaborate?ref=docs');
    });

    it('redirects secondary www domain www.aitathastu.com to https://aitathastu.info with 301 status', async () => {
      const res = await request(app)
        .get('/engineering')
        .set('Host', 'www.aitathastu.com');

      expect(res.status).toBe(301);
      expect(res.header.location).toBe('https://aitathastu.info/engineering');
    });

    it('redirects non-canonical www.aitathastu.info to apex https://aitathastu.info with 301 status', async () => {
      const res = await request(app)
        .get('/research')
        .set('Host', 'www.aitathastu.info');

      expect(res.status).toBe(301);
      expect(res.header.location).toBe('https://aitathastu.info/research');
    });

    it('redirects mentormaze.aitathastu.com to https://aitathastu.info/products/mentormaze with 301 status', async () => {
      const res = await request(app)
        .get('/')
        .set('Host', 'mentormaze.aitathastu.com');

      expect(res.status).toBe(301);
      expect(res.header.location).toBe('https://aitathastu.info/products/mentormaze');
    });

    it('validates vercel.json contains permanent 301 host redirections and security headers', () => {
      const vercelConfigPath = path.resolve(process.cwd(), 'vercel.json');
      expect(fs.existsSync(vercelConfigPath)).toBe(true);

      const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      expect(vercelConfig.redirects).toBeDefined();

      const hostsRedirected = vercelConfig.redirects.map((r: any) => r.has?.[0]?.value);
      expect(hostsRedirected).toContain('aitathastu.com');
      expect(hostsRedirected).toContain('www.aitathastu.com');
      expect(hostsRedirected).toContain('www.aitathastu.info');
      expect(hostsRedirected).toContain('mentormaze.aitathastu.com');

      // Verify all redirects are permanent: true (301)
      vercelConfig.redirects.forEach((r: any) => {
        expect(r.permanent).toBe(true);
        expect(r.destination).toContain('https://aitathastu.info');
      });

      // Verify HSTS and security headers
      const securityHeaders = vercelConfig.headers.find((h: any) => h.source === '/(.*)');
      expect(securityHeaders).toBeDefined();
      const hkeys = securityHeaders.headers.map((h: any) => h.key);
      expect(hkeys).toContain('Strict-Transport-Security');
      expect(hkeys).toContain('X-Content-Type-Options');
      expect(hkeys).toContain('X-Frame-Options');
    });

    it('validates index.html contains canonical tag and Open Graph metadata pointing to aitathastu.info', () => {
      const htmlPath = path.resolve(process.cwd(), 'index.html');
      const html = fs.readFileSync(htmlPath, 'utf8');

      expect(html).toContain('<link rel="canonical" href="https://aitathastu.info" />');
      expect(html).toContain('<meta property="og:url" content="https://aitathastu.info" />');
      expect(html).toContain('https://aitathastu.info/media/company/platform-overview.png');
    });

    it('validates sitemap.xml and robots.txt exist and point to https://aitathastu.info', () => {
      const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
      const robotsPath = path.resolve(process.cwd(), 'public/robots.txt');

      expect(fs.existsSync(sitemapPath)).toBe(true);
      expect(fs.existsSync(robotsPath)).toBe(true);

      const sitemap = fs.readFileSync(sitemapPath, 'utf8');
      const robots = fs.readFileSync(robotsPath, 'utf8');

      expect(sitemap).toContain('https://aitathastu.info/');
      expect(sitemap).toContain('https://aitathastu.info/products');
      expect(robots).toContain('Sitemap: https://aitathastu.info/sitemap.xml');
    });
  });

  describe('Part B: Authentic Image & Media Asset Registry', () => {
    it('verifies all registered media assets exist physically on disk in public/', () => {
      Object.entries(AUTHENTIC_MEDIA_REGISTRY).forEach(([key, asset]) => {
        const fullDiskPath = path.resolve(process.cwd(), 'public', asset.url.replace(/^\//, ''));
        expect(fs.existsSync(fullDiskPath), `File missing on disk for asset ${key}: ${fullDiskPath}`).toBe(true);
        const stat = fs.statSync(fullDiskPath);
        expect(stat.size).toBeGreaterThan(500); // Must be real non-empty file
      });
    });

    it('distinguishes live application screenshots from architectural prototypes accurately', () => {
      // Collaborate, Avsar, Connect, and Platform Overview must be Live Product Interfaces
      expect(AUTHENTIC_MEDIA_REGISTRY['collaborate-live'].provenance).toBe('Live Product Interface');
      expect(AUTHENTIC_MEDIA_REGISTRY['avsar-live'].provenance).toBe('Live Product Interface');
      expect(AUTHENTIC_MEDIA_REGISTRY['connect-live'].provenance).toBe('Live Product Interface');
      expect(AUTHENTIC_MEDIA_REGISTRY['platform-overview'].provenance).toBe('Live Product Interface');

      // MentorMaze and Iris must be Architectural Specifications, NOT fake screenshots
      expect(AUTHENTIC_MEDIA_REGISTRY['mentormaze-spec'].provenance).toBe('Verified Architectural Prototype');
      expect(AUTHENTIC_MEDIA_REGISTRY['iris-spec'].provenance).toBe('Verified Architectural Prototype');
    });

    it('resolves product authentic media via helper correctly', () => {
      const collabMedia = getProductAuthenticMedia('collaborate');
      expect(collabMedia?.url).toBe('/media/products/collaborate/collaborate-live.png');
      expect(collabMedia?.provenance).toBe('Live Product Interface');

      const mentorMedia = getProductAuthenticMedia('mentormaze');
      expect(mentorMedia?.url).toBe('/media/products/mentormaze/architecture-spec.svg');
      expect(mentorMedia?.provenance).toBe('Verified Architectural Prototype');
    });
  });
});
