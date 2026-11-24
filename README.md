# AI Tathastu Insights — Editorial Newsroom & Content Platform

Official newsroom, engineering blog, and newsletter publishing engine for the **AI Tathastu** student intelligence and university ecosystem.

Built with **SvelteKit 5 (Runes)**, **Tailwind CSS 4**, **Drizzle ORM**, **Neon Serverless PostgreSQL**, and **Cloudinary**.

---

## 🚀 The AI Tathastu Ecosystem

* **AI Tathastu**: Central intelligence and identity layer tracking *Declared*, *Observed*, and *Verified* student skill profiles.
* **MentorMaze**: Strategic mentorship network combining human industry leaders with **ASTRION** (Adaptive Strategic Intelligence & Reasoning Network).
* **Avsar**: Opportunity discovery engine matching verified student profiles to tech internships, hackathons, and research openings.
* **IRIS**: AI-proctored examination and skill readiness verification engine.
* **Collaborate**: Real-world project workspaces turning Git commits and pull requests into *Observed* portfolio skills.
* **Connect**: Relationship graph connecting students, alumni, and enterprise recruiters.
* **Meet**: Low-latency video infrastructure powered by WebRTC and LiveKit for mentorship and peer mock interviews.
* **AI Interviewer**: Conversational voice agent delivering simulated technical and behavioral interviews with instant readiness feedback.

---

## ⚡ Core Web Vitals & Performance Engineering

* **Time Complexity**:
  * **Keyset (Cursor-based) Pagination**: $O(1)$ database execution via `WHERE published_at < $cursor LIMIT 12`, eliminating slow SQL `OFFSET` traversals.
  * **Selective Column Projection**: DB queries project only essential columns on listing hubs, excluding heavy body HTML/JSON and cutting payloads by >90%.
  * **Edge Caching**: Configured with `Cache-Control: public, s-maxage=120, stale-while-revalidate=86400` for global sub-50ms TTFB on Vercel Edge.
  * **Client-Side Preloading**: Hover data prefetching via `data-sveltekit-preload-data="hover"` for instantaneous transitions.
* **Space Complexity**:
  * **Cloudinary Pipeline**: Dynamic `f_auto,q_auto:good` negotiation delivering AVIF/WebP with responsive `srcset` and `sizes`.
  * **Zero CLS**: Container aspect ratio bounding (`aspect-video`) and explicit `width`/`height` attributes on all media.
  * **LCP Prioritization**: Hero cover media carries `fetchpriority="high"`, `loading="eager"`, and `decoding="async"`.
  * **Memory Bounding**: Precompiled `Intl.DateTimeFormat` for $O(1)$ memory formatting; DOM bounded to $\le 12\text{–}15$ items per view.
* **Admin Compute Optimization**: Client-side SPA isolation via `export const ssr = false;` in `/admin/+layout.ts`.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | SvelteKit 5 (Svelte Runes `$state`, `$derived`, `$props`) |
| **Styling** | Tailwind CSS 4 + Typography Plugin + Custom Neomorphic System |
| **Database** | Neon (Serverless PostgreSQL) + Drizzle ORM |
| **Media Pipeline** | Cloudinary (Signed Direct Client Uploads, Auto Transcoding) |
| **Security & Headers** | Strict Content Security Policy (CSP), TLS 1.3, Rate Limiting, Honeypot Anti-Bot |
| **Search & AI** | Dynamic `sitemap.xml`, Fast RSS 2.0, JSON-LD Graph, `llms.txt` for AI Crawlers |

---

## 💻 Local Development

### 1. Prerequisites
- Node.js $\ge 18$
- npm $\ge 9$

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/anant9934/-AI-Tathastu-Insights.git
cd -AI-Tathastu-Insights

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 3. Environment Configuration
Ensure your `.env` contains:
```ini
DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
ADMIN_SESSION_SECRET="your-32-byte-hex-secret"
```

### 4. Database Migrations & Seed
```bash
# Push schema migrations
npm run db:push

# Seed demo ecosystem data
node scripts/seed-demo.js
```

### 5. Start Development Server
```bash
npm run dev -- --port 3001
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🔐 Admin CMS Desk

- **URL**: [http://localhost:3001/admin/login](http://localhost:3001/admin/login)
- **Authentication**: Passwordless single-use magic links. In local development mode, magic link URLs are logged directly to the terminal console.
- **RBAC**: Multi-role support (`Owner`, `Admin`, `Editor`, `Author`).
- **Features**: Post authoring, slug conflict resolution, Cloudinary media picker, subscriber double opt-in desk, CSV export, and tamper-evident audit logs.

---

## 📚 Documentation
- **Technical Specification (SRS)**: [`docs/SRS.md`](docs/SRS.md)
- **360° Search & AI Visibility Strategy**: [`docs/SEO-GEO-STRATEGY.md`](docs/SEO-GEO-STRATEGY.md)
- **AI Crawler Directives**: [`static/llms.txt`](static/llms.txt)

---

## 📄 License
Internal proprietary documentation and platform codebase. © 2026 AI Tathastu Insights. All rights reserved.
