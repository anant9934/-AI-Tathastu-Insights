# AI Tathastu Insights

> **Official Public Storytelling, Research & Systems Publication Platform of AI Tathastu**  
> An independent corporate publication documenting what we build, why we build it, and how each system functions in practice.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg)](https://expressjs.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-SQLite-C5F74F.svg)](https://orm.drizzle.team/)
[![Tests](https://img.shields.io/badge/Tests-43%2F43%20Passing-success.svg)](./src/test)

---

## 1. Product Vision & Positioning

AI Tathastu Insights documents the company's identity, systems, research, engineering progress, and media. The platform combines:
* **Corporate Storytelling:** Grounded narratives detailing why products are built and the market problems they address.
* **Technical Depth:** Architectural blueprints, prototype consoles, and mechanistic explanations.
* **Open Verification:** Transparent classification of working implementations, interactive prototypes, and planned deployment targets.
* **Peer-Reviewed Publishing:** Research paper archive with real-time Crossref DOI verification, BibTeX generation, and manuscript submission workflows.

---

## 2. Platform Architecture

```
ai-tathastu-insights/
├── src/                          # Frontend Application (React 19 + TypeScript)
│   ├── components/
│   │   ├── cards/                # StoryCard, EcosystemCard, EditorialCard
│   │   ├── hero/                 # HeroStorySlider (Cinematic Milestone Showcase)
│   │   ├── layout/               # Navbar, Footer, Sticky Header Indices
│   │   ├── motion/               # Reveal, StaggerContainer, AnimatedButton, AnimatedChart
│   │   ├── products/             # ProductConsoles & ProductShowcase (System Simulations)
│   │   └── ui/                   # Badge, Modal, Form Controls
│   ├── lib/                      # Design Tokens, Motion Easings, API Client, Datasets
│   ├── pages/                    # 10 Dedicated Route Views (Journal, Research, Ecosystem, etc.)
│   └── test/                     # Unit, Integration & Component Test Suites (Vitest)
├── server/                       # Backend Application (Node.js + Express)
│   ├── db/                       # Drizzle ORM Schema, SQLite Connection & Repositories
│   ├── middleware/               # JWT Auth, RBAC Authorization, Rate Limiting, Error Handling
│   ├── routes/                   # Auth, Research, Editorial, Bookmarks, Newsletter, Search
│   └── services/                 # Crossref DOI Verification, Citations, Manuscript Storage
├── drizzle/                      # Database Migrations & SQL Snapshots
└── dist/                         # Optimized Production Build Artifacts
```

---

## 3. Core Ecosystem Systems & Prototypes

The platform features interactive UI consoles and architectural blueprints for AI Tathastu's foundational systems:

| System | Domain | Current Status | Key Focus |
| :--- | :--- | :--- | :--- |
| **MentorMaze** | Research Pedagogy | **Interactive Prototype** | Socratic kernel debugger modeling prerequisite DAGs across 120k+ ML preprints. |
| **Collaborate** | Distributed Systems | **In Development** | Proposed Aegis-BFT Byzantine consensus engine targeting sub-200ms quorums across 64 agents. |
| **Avsar** | Research Infrastructure | **In Development** | Preprint benchmark verification pipeline allocating compute credits directly to contributors. |
| **Iris** | Embodied Perception | **In Development** | 3D voxel occupancy memory HUD simulation targeting 80+ FPS on embedded edge hardware. |

---

## 4. Production Backend & Data Integrity

* **Relational Persistence:** SQLite database managed via Drizzle ORM with foreign keys, cascading deletions, and timestamp audits (`users`, `articles`, `research_papers`, `bookmarks`, `subscribers`, `manuscripts`).
* **Crossref DOI Verification:** Live REST client querying the official Crossref API (`https://api.crossref.org/works/{doi}`) to validate preprint metadata, resolve titles, and extract authoritative publication dates.
* **Application Security:** JWT bearer authentication with bcrypt password salting (10 rounds), strict role-based access control (`reader`, `author`, `editor`, `admin`), and in-memory rate limiting.
* **Testing Rigor:** 43 comprehensive tests spanning backend endpoints, page rendering, interactive components, and design system tokens.

---

## 5. Getting Started

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/anant9934/-AI-Tathastu-Insights.git
cd -AI-Tathastu-Insights

# Install dependencies
npm install
```

### Development Server
```bash
# Start Vite development server (http://localhost:5173)
npm run dev
```

### Production Build
```bash
# Type check with tsc and compile optimized bundle with Vite
npm run build
```

### Running Test Suite
```bash
# Execute Vitest test runner
npm test
```

---

## 6. Design System & Typography

The visual identity uses a modern editorial aesthetic:
* **Display / Serifs:** *Newsreader* & *Fraunces* for editorial weight and authority.
* **Interface / Sans:** *DM Sans* & *Inter* for accessible, responsive navigation.
* **Code / Monospace:** *IBM Plex Mono* & *JetBrains Mono* for system metrics, consoles, and logs.
* **Contrast Standards:** Fully WCAG 2.1 AA compliant across both light (`#FBFBF9` canvas) and dark (`#0B0F17` surface) themes.

---

## 7. License & Rights

Copyright © 2026 AI Tathastu. All rights reserved. Open-source client code released under the MIT License.
