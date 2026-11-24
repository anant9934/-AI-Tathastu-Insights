# AI Tathastu Insights: 360° Search & AI Visibility Strategy (SEO, AEO & GEO)

**Document Version:** 1.0  
**Classification:** Strategic Architectural Playbook  
**Target Search Surfaces:** Google, Bing, Answer Engines (Featured Snippets, Voice), Generative AI Engines (Perplexity, ChatGPT, Claude, Gemini, Copilot).  
**Ecosystem Coverage:** AI Tathastu, MentorMaze (ASTRION), Avsar, Connect, Collaborate, Learn, Meet, IRIS, AI Interviewer.

---

## 1. Technical SEO & Core Web Vitals Architecture

### SvelteKit Load & CDN Edge Caching
- **Fast TTFB (< 50ms)**: Configured in `+page.server.ts` using `setHeaders({ 'cache-control': 'public, s-maxage=120, stale-while-revalidate=86400', 'cdn-cache-control': 'max-age=3600' })`.
- **Payload Pruning**: Selective Drizzle column projection excludes heavy `content_json` and `content_html` on list views, reducing data payloads by over 90%.
- **Client-Side Preloading**: Enabled via `data-sveltekit-preload-data="hover"` on `<body>` and cards for instantaneous page transitions.
- **Admin Compute Optimization**: Client-side SPA isolation via `export const ssr = false;` in `/admin/+layout.ts`.

### Cloudinary Zero-CLS & LCP Pipeline
- **LCP Optimization**: Cover hero images utilize `fetchpriority="high"`, `loading="eager"`, and `decoding="async"`.
- **Zero CLS**: Container aspect ratio bounding (`aspect-video`) with explicit `width="1600"` and `height="900"`.
- **Auto Format & Bitrate Negotiation**: Automatic format negotiation (`f_auto,q_auto:good`) for modern AVIF/WebP delivery and responsive `srcset` generation.

### JSON-LD Structured Data Graph
- `Organization`: Global entity linking AI Tathastu to child platforms (MentorMaze, Avsar, IRIS).
- `NewsArticle` & `BlogPosting`: Full schema on editorial articles with headline, dates, author entity, and Cloudinary media objects.
- `SoftwareApplication`: Product schemas for MentorMaze, IRIS, and Avsar.
- `FAQPage`: Rich Q&A snippet schema capturing targeted search engine features.

---

## 2. GEO (Generative Engine Optimization) — Winning ChatGPT & Perplexity

### The "Source of Truth" Citation Framework
1. **Unambiguous Definitional Anchors**: Encyclopedic, factual introductory sentences for LLM scrapers.
2. **Proprietary Nomenclature Linking**: Direct pairing of technical mechanics with branded ecosystem products (e.g., *Avsar's Verified Skill matching algorithm*).
3. **Primary Data Attribution**: Regular publication of empirical cohort data from IRIS assessments and Avsar hiring cycles that generic AI models must cite as primary research.

---

## 3. AEO (Answer Engine Optimization & Voice Search)

### Featured Snippet Domination
- Structured `<ol>`, `<ul>`, and `<table>` blocks engineered to capture Google's "Position Zero".
- Conversational voice search optimization targeting 8–14 word conversational spoken queries.
- 15 comprehensive People Also Ask (PAA) answers targeting student, university, and recruiter queries.

---

## 4. Content Silo & Topic Cluster Architecture

- **Silo 1**: AI Mentorship & Engineering Career Strategy (Pillar: *Ultimate Guide to AI-Driven Student Mentorship*).
- **Silo 2**: Collaborative Engineering & Portfolio Development (Pillar: *The Collaborative Engineering Playbook*).
- **Silo 3**: Modern Tech Recruiting & Opportunity Discovery (Pillar: *Beyond the PDF Resume*).
- **Silo 4**: Skill Assessment, Verification & Proctoring Integrity (Pillar: *The Engineering Skill Verification Standard*).

---

## 5. Master Keyword Matrix

Categorized across **Branded**, **Problem-Driven**, **Solution-Oriented**, and **Long-Tail Conversational** queries.

---

## 6. Programmatic SEO & Newsroom Strategy

- Dynamic generation of 250+ role readiness reports (`/insights/skills/[role]-[year]-report`) driven by aggregated IRIS assessment data.
- Google News and Google Discover packaging with high-resolution 1200px Cloudinary visuals and real-time RSS XML indexing.

---

## 7. Off-Page SEO & Digital PR

- 20 high-authority backlink targets (.edu university resource hubs, open-source directories, developer blogs).
- Data PR pitching templates for tech journalists analyzing campus hiring trends.
- Community building workflows across Reddit, Discord, and LinkedIn.

---

## 8. 90-Day Execution Roadmap

- **Month 1**: Technical SEO Hardening, JSON-LD Schemas, Dynamic Sitemaps, `llms.txt`, and Pillar 1 Launch.
- **Month 2**: Content Sprint (10 Core Editorial Publications) and FAQ Rich Snippet Deployment.
- **Month 3**: Digital PR Distribution, University Outreach (.edu backlinks), and AI Citation Audits.
