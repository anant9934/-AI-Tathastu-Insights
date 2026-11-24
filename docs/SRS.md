# Software Requirements Specification (SRS)
## Company News & Newsletter Platform

| Field | Value |
|---|---|
| **Document ID** | SRS-NEWS-001 |
| **Version** | 1.0 |
| **Status** | Baseline — for development |
| **Standard** | IEEE 830 / ISO/IEC/IEEE 29148 |
| **Companion docs** | System Design v1.0 (SDD-NEWS-001), UI/UX Spec v1.0 (UXD-NEWS-001) |
| **Classification** | Internal |
| **Prepared by** | Systems Engineering |
| **Approved by** | _pending_ |

---

## Table of Contents

1. Introduction
2. Overall Description
3. Functional Requirements
4. External Interface Requirements
5. Non-Functional Requirements
6. Data Requirements
7. System Behavior & States
8. Constraints, Assumptions & Dependencies
9. Verification & Acceptance
10. Traceability Matrix
11. Appendices

---

# 1. Introduction

## 1.1 Purpose

This document specifies the complete functional and non-functional requirements for a **company news, newsletter, and ecosystem updates platform** comprising a public editorial website and an authenticated administration dashboard. It is the contractual reference for design, implementation, testing, and acceptance.

It is written to be **sufficient for a development team to build from without further clarification**, and **specific enough to be testable** — every requirement carries a priority and a verification method.

## 1.2 Scope

### 1.2.1 In Scope

| Capability | Description |
|---|---|
| Public editorial site | Home, news hub, newsletter hub, ecosystem hub, changelog, article pages, category pages, search, 404/500 |
| Content management | Create, edit, preview, schedule, publish, unpublish, archive, soft-delete, restore, revise, duplicate |
| Media management | Signed direct upload to Cloudinary, media library, mandatory alt text, reuse, deletion with usage checks |
| Newsletter subscriptions | Double opt-in capture, confirmation, unsubscribe, subscriber management, CSV export |
| Administration | Role-based dashboard, posts table, editor, media library, subscribers, redirects, audit log, settings |
| Discovery & distribution | RSS, sitemap, robots, OpenGraph, JSON-LD, full-text search |
| Security | Authentication, authorization, CSRF, XSS prevention, CSP, rate limiting, secret management |
| Operations | Caching, cache invalidation, scheduled publishing, logging, health checks, backups |

### 1.2.2 Out of Scope

| Excluded | Rationale |
|---|---|
| Comments / user-generated content | Not required; removes a major attack surface |
| Multi-tenant / multi-site | Single company, single publication |
| E-commerce, payments | Not a commercial content product |
| Bulk newsletter delivery engine | Delegated to external ESP (see FR-NEWS-07) |
| Native mobile apps | Responsive web is sufficient |
| Public user accounts | Only internal staff authenticate |
| Rich analytics dashboard | External tool (Vercel Analytics / Plausible) |
| Real-time collaboration / co-editing | Not required at team size |
| Mobile rich-text editing | Explicitly excluded at `<768px` (UX decision) |
| Localization / i18n | English only in v1; architecture must not preclude it |

## 1.3 Definitions, Acronyms & Abbreviations

| Term | Definition |
|---|---|
| **Post** | Any content item in the `posts` table; one of `article`, `announcement`, `newsletter`, `changelog` |
| **Kind** | The content type discriminator of a post |
| **Slug** | URL-safe unique identifier for a post, e.g. `how-we-build-ecosystem` |
| **Publish** | Transition a post from `draft`/`scheduled` to publicly visible (`published`) |
| **Revision** | Immutable JSON snapshot of a post taken on each save/publish |
| **Soft delete** | Marking a record `deleted_at` rather than physically removing it |
| **RBAC** | Role-Based Access Control |
| **Owner / Editor / Author / Viewer** | The four staff roles (see §2.4) |
| **Magic link** | Passwordless authentication via single-use emailed token |
| **Signed upload** | Cloudinary upload authorized by a server-generated signature |
| **Cache purge** | Explicit invalidation of a cached public path or tag |
| **SWR** | Stale-While-Revalidate cache directive |
| **PITR** | Point-In-Time Recovery (Neon) |
| **ESP** | Email Service Provider (bulk delivery) |
| **FTS** | Full-Text Search (Postgres `tsvector`) |
| **AA** | WCAG 2.2 conformance level AA |
| **MoSCoW** | Must / Should / Could / Won't prioritization |
| **T / I / A / D** | Verification by Test / Inspection / Analysis / Demonstration |

## 1.4 References

| ID | Document |
|---|---|
| R1 | SDD-NEWS-001 — System Design Document v1.0 |
| R2 | UXD-NEWS-001 — UI/UX Design Specification v1.0 |
| R3 | WCAG 2.2 (W3C Recommendation) |
| R4 | OWASP ASVS v4.0 Level 2 |
| R5 | OWASP Top 10 (2021) |
| R6 | GDPR (EU 2016/679); CAN-SPAM Act |
| R7 | SvelteKit, Drizzle ORM, Neon, Cloudinary, Vercel platform documentation |
| R8 | Vercel Terms of Service (commercial use clause) |

## 1.5 Document Conventions

- **Priority:** `MUST` (MoSCoW Must), `SHOULD`, `COULD`, `WON'T` (v1).
- **Requirement ID format:** `FR-<MODULE>-<NN>` for functional, `NFR-<CAT>-<NN>` for non-functional.
- **Verification:** `T` = Test, `I` = Inspection, `A` = Analysis, `D` = Demonstration.
- **Acceptance criteria** use Given/When/Then where behavioral.
- The word **shall** denotes a mandatory requirement; **should** a recommended one.

---

# 2. Overall Description

## 2.1 Product Perspective

The platform is a **standalone, self-hosted, single-tenant web application**. It replaces dependency on third-party blog platforms with an owned property that:

- Publishes company news, announcements, newsletter issues, ecosystem/partner updates, and a product changelog.
- Captures newsletter subscribers with consent (double opt-in).
- Provides internal staff a private dashboard to author and manage content without developer involvement.

It is a **read-heavy, write-light** system (~1000:1 read:write). It has no background workers, no message queues, and no persistent server processes — all execution is request-scoped serverless functions plus scheduled triggers.

## 2.2 Product Functions (Summary)

| # | Function group | Summary |
|---|---|---|
| F1 | Public publishing | Serve editorial pages as cached, server-rendered HTML with SEO metadata |
| F2 | Content authoring | Rich-text editing, media embedding, drafting, revisioning |
| F3 | Publishing workflow | Draft → (schedule) → publish → archive/soft-delete, with audit |
| F4 | Media management | Upload, organize, describe (alt text), reuse, delete assets |
| F5 | Newsletter capture | Consent-based subscription with confirmation and unsubscribe |
| F6 | Discovery | Search, categories, RSS, sitemap, related content |
| F7 | Access control | Passwordless auth with four-tier RBAC |
| F8 | Governance | Audit logging, redirect management, revision history |
| F9 | Operations | Caching, invalidation, rate limiting, scheduled publishing, health checks |

## 2.3 User Classes & Characteristics

| Class | Frequency | Technical skill | Privileges | Notes |
|---|---|---|---|---|
| **Anonymous Reader** | High volume | Any | Public read only | Mobile-first; may arrive from social/email/RSS |
| **Subscriber** | Medium | Low | Public read + receive email | Identified by email only; no account |
| **Viewer** (staff) | Low | Low | Admin read-only | e.g., stakeholder reviewing drafts |
| **Author** (staff) | 1–3 posts/week | Low–medium | Create/edit own drafts; no publish | Not a developer; expects autosave |
| **Editor** (staff) | Daily | Medium | Full content lifecycle, media delete, subscribers | Primary daily operator |
| **Owner** (staff) | Weekly | Medium–high | All Editor rights + user/role management, audit, settings | Typically 1–2 people |
| **System Operator** | On-demand | High | Deployment, env vars, DB access, monitoring | Does not use the admin UI for content |

**Assumption:** total staff accounts ≤ 10 at launch, ≤ 50 within 2 years.

## 2.4 Operating Environment

| Layer | Environment |
|---|---|
| **Client** | Evergreen browsers: Chrome/Edge ≥ 120, Firefox ≥ 120, Safari ≥ 17 (desktop + iOS), Chrome Android ≥ 120. No IE, no legacy Edge. |
| **Server runtime** | Vercel serverless functions (Node.js 20 LTS runtime) |
| **CDN/Edge** | Vercel Edge Network |
| **Database** | Neon Serverless Postgres 16 (pooled + unpooled endpoints) |
| **Media** | Cloudinary (CDN delivery + Admin API) |
| **Email (transactional)** | Resend API |
| **Rate limiting** | Upstash Redis (REST) |
| **Scheduling** | Vercel Cron |
| **Minimum client viewport** | 320px width |
| **Network** | Must function on 3G (~1.6 Mbps) for read paths |

## 2.5 Design & Implementation Constraints

| ID | Constraint | Source |
|---|---|---|
| C-01 | Deployment target shall be **Vercel**; no persistent server processes | Platform decision |
| C-02 | Database shall be **Neon Postgres**; no other DB engine | Platform decision |
| C-03 | Media shall be stored and delivered via **Cloudinary**; no local/binary persistence in the app or DB | Platform decision |
| C-04 | The application filesystem is **ephemeral and read-only** at runtime | Vercel |
| C-05 | Serverless request body limit is **4.5 MB** | Vercel |
| C-06 | Implementation shall be **single-language**: TypeScript across frontend, server, and data access | SDD ADR-1 |
| C-07 | ORM shall be **Drizzle**; no Prisma, no raw string-concatenated SQL | SDD ADR-2 |
| C-08 | Public read path shall not require JavaScript to render content | UX principle 1 |
| C-09 | Commercial use requires **Vercel Pro**; Hobby plan is not compliant | R8 |
| C-10 | Cloudinary consumption shall be capped at **3 transformation variants** | SDD §8.2 |
| C-11 | No public registration endpoint shall exist | SDD ADR-9 |
| C-12 | Bulk email delivery shall be delegated to an external ESP | SDD ADR-7 |

## 2.6 Assumptions & Dependencies

| ID | Assumption / Dependency | Impact if invalid |
|---|---|---|
| A-01 | Staff ≤ 10; concurrent admin editors ≤ 3 | Concurrency controls would need hardening |
| A-02 | Peak public RPS ≤ 100 | Cache tiers would need redesign |
| A-03 | Cloudinary free tier (25 credits/mo) is initially sufficient | Cost increase or self-hosted media |
| A-04 | Neon free tier compute (100 CU-hr) is sufficient with caching | Upgrade required |
| A-05 | ESP handles deliverability, bounces, DMARC, compliance | Must build own mail infra (rejected) |
| A-06 | English-only content in v1 | Schema/i18n rework |
| A-07 | Vercel Cron minimum granularity (~1 minute) is acceptable for scheduled publishing | Alternative scheduler required |
| D-01 | Neon–Vercel integration available for branch-based preview DBs | Manual DB provisioning per preview |
| D-02 | Cloudinary Admin API reachable from serverless functions | Upload commit verification impossible |

---

# 3. Functional Requirements

Priority legend: **M** = Must, **S** = Should, **C** = Could, **W** = Won't (v1).
Verification: **T** Test, **I** Inspection, **A** Analysis, **D** Demonstration.

---

## 3.1 Module AUTH — Authentication & Authorization

### FR-AUTH-01 — Passwordless Magic-Link Login
- **Priority:** M · **Verification:** T, D
- **Actors:** Viewer, Author, Editor, Owner
- **Description:** The system shall authenticate staff exclusively via single-use, time-limited emailed magic links. No password shall be stored or accepted.
- **Preconditions:** A user record exists with `email_verified` state and role assigned.
- **Main flow:**
  1. User navigates to `/admin` unauthenticated → redirected to `/admin/login`.
  2. User submits email address.
  3. System responds with a **generic success message regardless of whether the email exists** ("If an account exists, a sign-in link has been sent.").
  4. If the user exists, system generates a single-use token, stores its hash with a 15-minute expiry, and sends a link via Resend.
  5. User opens the link → token validated → session cookie issued → redirect to `/admin`.
- **Alternate flows:**
  - **A1 — Expired token:** show *"This link has expired. Request a new one."* with a resend action.
  - **A2 — Reused token:** reject, show *"This link has already been used."*, do not reveal account state.
  - **A3 — Unknown email:** no email sent; identical response to main flow (anti-enumeration).
- **Business rules:**
  - BR-AUTH-01.1 Token shall be single-use and invalidated on first successful redemption.
  - BR-AUTH-01.2 Only the token **hash** shall be persisted.
  - BR-AUTH-01.3 Token lifetime ≤ 15 minutes.
  - BR-AUTH-01.4 Response time for existing and non-existing emails shall not differ observably (timing normalization / constant-time comparison).
- **Acceptance criteria:**
  - Given a valid staff email, when submitted, then a magic link email arrives and the response body is identical to that for an unknown email.
  - Given a consumed link, when opened again, then access is denied with the reuse message.

### FR-AUTH-02 — No Public Registration
- **Priority:** M · **Verification:** I, T
- **Description:** The system shall expose **no** public sign-up, invitation-acceptance-without-token, or self-service account-creation endpoint. Accounts are created exclusively by an Owner.
- **Acceptance criteria:** Given anonymous access, when any unauthenticated write to `users` is attempted, then the request is rejected with 403.

### FR-AUTH-03 — Session Management
- **Priority:** M · **Verification:** T, I
- **Description:** Sessions shall be issued as signed, HTTP-only cookies.
- **Business rules:**
  - BR-AUTH-03.1 Cookie attributes: `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, name prefixed `__Host-`.
  - BR-AUTH-03.2 Sliding expiry of **7 days**; absolute expiry of **30 days**.
  - BR-AUTH-03.3 Session shall be revocable server-side (see FR-AUTH-08).
  - BR-AUTH-03.4 Session cookie shall never appear in URLs, logs, or client-readable storage.

### FR-AUTH-04 — Role-Based Access Control
- **Priority:** M · **Verification:** T, D
- **Description:** The system shall enforce four roles with the following permission matrix.

| Capability | Viewer | Author | Editor | Owner |
|---|:--:|:--:|:--:|:--:|
| Access admin UI | ✔ | ✔ | ✔ | ✔ |
| View all posts | ✔ | ✔ | ✔ | ✔ |
| Create post | ✘ | ✔ | ✔ | ✔ |
| Edit **own** posts | ✘ | ✔ | ✔ | ✔ |
| Edit **any** post | ✘ | ✘ | ✔ | ✔ |
| Publish / schedule | ✘ | ✘ | ✔ | ✔ |
| Unpublish / archive | ✘ | ✘ | ✔ | ✔ |
| Soft-delete post | ✘ | ✘ | ✔ | ✔ |
| Restore post | ✘ | ✘ | ✘ | ✔ |
| Hard-delete post | ✘ | ✘ | ✘ | ✔ |
| Upload media | ✘ | ✔ | ✔ | ✔ |
| Delete **own** media | ✘ | ✔ | ✔ | ✔ |
| Delete **any** media | ✘ | ✘ | ✔ | ✔ |
| View subscribers | ✘ | ✘ | ✔ | ✔ |
| Export subscribers | ✘ | ✘ | ✔ | ✔ |
| Manage redirects | ✘ | ✘ | ✔ | ✔ |
| View audit log | ✘ | ✘ | ✘ | ✔ |
| Manage users & roles | ✘ | ✘ | ✘ | ✔ |
| Manage settings | ✘ | ✘ | ✘ | ✔ |

### FR-AUTH-05 — Authorization at Mutation Boundary
- **Priority:** M · **Verification:** T, I
- **Description:** Every server action and API route performing a read of protected data or any write shall **re-verify** the caller's role server-side. Client-side hiding of UI shall never be the sole control.
- **Business rules:** BR-AUTH-05.1 A `requireRole(user, [...roles])` guard shall be the first statement in every protected action. BR-AUTH-05.2 Route-level redirects are UX only and shall not substitute for the guard.
- **Acceptance criteria:** Given an Author session, when a crafted request invokes the publish action directly, then the response is 403 and no state changes.

### FR-AUTH-06 — Multi-Factor Authentication for Privileged Roles
- **Priority:** S · **Verification:** D
- **Description:** Owner and Editor accounts shall support TOTP MFA, enforceable per-user, and mandatory for Owner by configuration.

### FR-AUTH-07 — Authentication Rate Limiting
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-AUTH-07.1 ≤ 5 magic-link requests per 15 min per IP **and** per email.
  - BR-AUTH-07.2 ≤ 10 token-redemption attempts per 15 min per IP.
  - BR-AUTH-07.3 Exceeding limits returns HTTP 429 with *"Too many attempts. Try again in 15 minutes."*
  - BR-AUTH-07.4 Rate-limit state shall not reveal account existence.

### FR-AUTH-08 — Logout & Session Revocation
- **Priority:** M · **Verification:** T
- **Description:** Users shall be able to log out, invalidating the session server-side. Owners shall be able to revoke all sessions for any user.
- **Acceptance criteria:** Given an active session, when logout completes, then replaying the old cookie is rejected.

### FR-AUTH-09 — User Administration
- **Priority:** M · **Verification:** D
- **Actors:** Owner
- **Description:** Owner shall be able to list users, create a user (email + role + name), change a user's role, deactivate a user, and re-send a magic link.
- **Business rules:**
  - BR-AUTH-09.1 The system shall prevent demotion/deactivation of the **last** Owner.
  - BR-AUTH-09.2 Deactivated users shall be denied authentication immediately.
  - BR-AUTH-09.3 Role changes shall be recorded in the audit log with before/after values.

### FR-AUTH-10 — Session Expiry UX
- **Priority:** M · **Verification:** D
- **Description:** On expiry during an editing session, the system shall display a blocking modal (*"You've been signed out. Sign in to continue."*) and preserve unsaved form state in local storage for recovery after re-authentication.

---

## 3.2 Module CMS — Content Management

### FR-CMS-01 — Create Post
- **Priority:** M · **Verification:** T, D
- **Actors:** Author, Editor, Owner
- **Description:** An authorized user shall be able to create a post of kind `article`, `announcement`, `newsletter`, or `changelog`.
- **Business rules:**
  - BR-CMS-01.1 **Only `title` is mandatory** to create a draft; all other fields are optional at creation.
  - BR-CMS-01.2 A new post defaults to `status = draft`, `kind = article`, `author_id = current user`.
  - BR-CMS-01.3 Creation generates a UUID primary key.

### FR-CMS-02 — Rich-Text Editing
- **Priority:** M · **Verification:** D, T
- **Description:** The editor shall provide block-based rich text with at minimum: paragraph, H2, H3, bold, italic, inline code, link, bulleted list, numbered list, blockquote, image (from media library), code block, horizontal rule, and embed (allowlisted domains only).
- **Business rules:**
  - BR-CMS-02.1 Content shall be persisted as **structured JSON** (source of truth) **and** as precomputed sanitized HTML.
  - BR-CMS-02.2 The editor canvas shall render using the **same typographic styles** as the public article body.
  - BR-CMS-02.3 Heading levels offered shall be constrained to H2/H3 (the H1 is the post title).
  - BR-CMS-02.4 Paste from external sources shall be sanitized on paste and again on save.

### FR-CMS-03 — Autosave
- **Priority:** M · **Verification:** D, T
- **Business rules:**
  - BR-CMS-03.1 Autosave triggers **1.5 s** after the last change (debounced).
  - BR-CMS-03.2 A visible status indicator shall cycle: *Unsaved changes* → *Saving…* → *Saved {relative time}*, exposed via `aria-live="polite"`.
  - BR-CMS-03.3 A failed autosave shall display a persistent inline error with a **Retry** action and shall **not** discard in-memory edits.

### FR-CMS-04 — Local Draft Recovery
- **Priority:** M · **Verification:** T, D
- **Description:** The system shall snapshot the editor state to client-side storage every **10 s** and offer recovery after an unexpected reload or crash.
- **Acceptance criteria:** Given unsaved edits and a forced reload, when the editor reopens, then a prompt offers *"Restore unsaved changes from {time}?"* and restoring repopulates the editor.

### FR-CMS-05 — Slug Generation & Uniqueness
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-CMS-05.1 Slug auto-derives from the title (lowercase, ASCII transliteration, hyphen-separated, max 80 chars) until manually edited.
  - BR-CMS-05.2 Once manually edited, auto-derivation is disabled and a lock toggle is exposed to re-enable it.
  - BR-CMS-05.3 Slugs shall be unique among non-deleted posts; collisions append `-2`, `-3`, …
  - BR-CMS-05.4 Changing the slug of a **published** post shall create a redirect record from old path to new path (see FR-PUB-13).
  - BR-CMS-05.5 Reserved slugs shall be rejected (`admin`, `api`, `rss.xml`, `sitemap.xml`, `search`, and all top-level hub segments).

### FR-CMS-06 — Excerpt Derivation
- **Priority:** S · **Verification:** T
- **Business rules:**
  - BR-CMS-06.1 Excerpt auto-populates from the first paragraph's plaintext until manually edited.
  - BR-CMS-06.2 The UI shall display a live character count against a **160-character** recommendation.
  - BR-CMS-06.3 On publish, if the excerpt is empty, the system shall derive one from `content_text`.

### FR-CMS-07 — Save as Draft
- **Priority:** M · **Verification:** T
- **Description:** Any authorized user with edit rights on the post shall be able to persist changes with `status = draft` without making the content publicly accessible.
- **Acceptance criteria:** Given a draft saved, when an anonymous reader requests its URL, then a 404 is returned.

### FR-CMS-08 — Publish
- **Priority:** M · **Verification:** T, D
- **Actors:** Editor, Owner
- **Preconditions:** Post has a non-empty title.
- **Main flow:**
  1. User invokes Publish (button or `⌘↵` with confirmation).
  2. System validates required fields.
  3. System sanitizes content, computes derived fields (HTML, plaintext, reading time), sets `status = published`, `published_at = now()`.
  4. System writes a revision snapshot and an audit entry **within the same transaction**.
  5. After commit, system initiates cache invalidation (non-blocking).
- **Postconditions:** Post is publicly retrievable; cache invalidation is best-effort.
- **Business rules:**
  - BR-CMS-08.1 Publish shall **not fail** because of cache-invalidation failure; the failure is logged and alerted.
  - BR-CMS-08.2 Publishing an already-published post updates `updated_at` and regenerates derived fields.
  - BR-CMS-08.3 Authors shall not be able to publish.

### FR-CMS-09 — Scheduled Publishing
- **Priority:** S · **Verification:** T
- **Description:** An Editor/Owner shall be able to set `scheduled_for` (future timestamp); the post transitions to `published` automatically at that time.
- **Business rules:**
  - BR-CMS-09.1 A scheduled job shall run at ≤ 1-minute granularity.
  - BR-CMS-09.2 The job shall be **idempotent** and safe to run concurrently.
  - BR-CMS-09.3 Scheduled posts shall not be publicly visible before their time; preview requires an authenticated session or signed preview token.
  - BR-CMS-09.4 A scheduled post may be cancelled (reverting to `draft`) at any time before execution.
  - BR-CMS-09.5 If the scheduled job fails, the post remains `scheduled` and an alert shall be raised; it shall publish on the next successful run.

### FR-CMS-10 — Unpublish / Archive
- **Priority:** M · **Verification:** T
- **Description:** Editor/Owner shall be able to transition a published post to `draft` (unpublish) or `archived`.
- **Business rules:** BR-CMS-10.1 Unpublished/archived posts shall return 404 (or 410 for archived, configurable) to anonymous readers. BR-CMS-10.2 The action is audited and triggers cache invalidation.

### FR-CMS-11 — Soft Delete, Restore & Hard Delete
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-CMS-11.1 Delete sets `deleted_at`; the record and its media references are retained for **30 days**.
  - BR-CMS-11.2 Soft-deleted posts are excluded from all public and admin default listings and return 404 publicly.
  - BR-CMS-11.3 Owner may restore within 30 days.
  - BR-CMS-11.4 Owner may hard-delete; hard delete requires explicit typed confirmation and is audited.
  - BR-CMS-11.5 Media referenced by a soft-deleted post shall **not** be automatically deleted.

### FR-CMS-12 — Revision History
- **Priority:** S · **Verification:** T, D
- **Description:** The system shall store an immutable JSON snapshot of the post on every publish and every manual save (throttled to ≤ 1 per 5 minutes per post).
- **Business rules:**
  - BR-CMS-12.1 Editor/Owner may view a revision list and a read-only diff or snapshot view.
  - BR-CMS-12.2 Restoring a revision creates a **new** revision rather than deleting history.
  - BR-CMS-12.3 Revision retention: last **50** per post, plus all publish snapshots.

### FR-CMS-13 — Preview
- **Priority:** M · **Verification:** D
- **Description:** The system shall render a draft or scheduled post using the **production public template**, accessible only to authenticated staff or via a short-lived signed preview token.
- **Business rules:** BR-CMS-13.1 Preview responses shall carry `noindex, nofollow` and `Cache-Control: no-store`. BR-CMS-13.2 Preview tokens expire in 60 minutes and are single-post scoped.

### FR-CMS-14 — Duplicate Post
- **Priority:** C · **Verification:** D
- **Description:** Editor/Owner may duplicate a post; the copy is created as `draft` with title suffixed *"(copy)"*, a new slug, and no publish metadata.

### FR-CMS-15 — Categories & Tags
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-CMS-15.1 Each post may have **exactly one** category (or none) and **0..n** tags.
  - BR-CMS-15.2 Categories are curated by Editor/Owner and have a name and slug.
  - BR-CMS-15.3 Tags are free-form, normalized to lowercase, deduplicated, max 10 per post, max 32 chars each.
  - BR-CMS-15.4 Category deletion reassigns affected posts to no category (no cascade delete of posts).

### FR-CMS-16 — Content Sanitization
- **Priority:** M · **Verification:** T, I
- **Description:** All HTML persisted in `content_html` shall be produced by the server from the structured JSON through an **allowlist sanitizer**.
- **Business rules:**
  - BR-CMS-16.1 Allowed tags: `p, h2, h3, strong, em, code, pre, a, ul, ol, li, blockquote, img, figure, figcaption, hr, br`.
  - BR-CMS-16.2 Allowed attributes: `href` (http/https/mailto only), `src` (Cloudinary or allowlisted domains), `alt`, `title`, `width`, `height`.
  - BR-CMS-16.3 All `on*` attributes, `<script>`, `<style>`, `<iframe>` (unless allowlisted embed), `<object>`, `<embed>`, and `javascript:`/`data:` URLs shall be stripped.
  - BR-CMS-16.4 Sanitization runs **at write time**, not read time.
  - BR-CMS-16.5 External links shall receive `rel="noopener noreferrer"`.

### FR-CMS-17 — Reading Time
- **Priority:** C · **Verification:** T
- **Description:** The system shall compute and display estimated reading time at 200 words per minute, rounded up to the nearest minute, minimum 1.

### FR-CMS-18 — SEO Metadata
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-CMS-18.1 Each post supports `seo_title` (≤ 60 chars recommended) and `seo_description` (≤ 160 chars recommended), both optional.
  - BR-CMS-18.2 Fallbacks: `seo_title` → post title; `seo_description` → excerpt → first 160 chars of plaintext.
  - BR-CMS-18.3 A cover image (or configured default) is used as the OpenGraph image.
  - BR-CMS-18.4 Character overruns display a non-blocking warning, not an error.

### FR-CMS-19 — Admin Listing: Filter, Sort, Search
- **Priority:** M · **Verification:** T, D
- **Description:** The posts table shall support filtering by status and kind, sorting by updated/published date and title, and server-side search on title.
- **Business rules:** BR-CMS-19.1 List queries shall be paginated (default 20) and shall not load `content_json`/`content_html`. BR-CMS-19.2 Filter state shall be reflected in the URL.

### FR-CMS-20 — Bulk Actions
- **Priority:** C · **Verification:** D
- **Description:** Editor/Owner may select multiple posts and apply a single action (publish, unpublish, archive, soft-delete) with one confirmation.
- **Business rules:** BR-CMS-20.1 Bulk actions are transactional per item; partial failures are reported per item.

---

## 3.3 Module MED — Media Management

### FR-MED-01 — Signed Direct Upload
- **Priority:** M · **Verification:** T, D
- **Actors:** Author, Editor, Owner
- **Main flow:**
  1. Client requests upload authorization from the server.
  2. Server validates role, generates Cloudinary signature with constrained parameters, returns `{timestamp, signature, api_key, folder, allowed_formats, max_file_size}`.
  3. Client uploads **directly** to Cloudinary.
  4. Client calls the commit endpoint with the resulting `public_id`.
  5. Server verifies the asset via Cloudinary Admin API, enforces alt text and constraints, and inserts the `media` record.
- **Business rules:**
  - BR-MED-01.1 `CLOUDINARY_API_SECRET` shall **never** be transmitted to the client.
  - BR-MED-01.2 Binary file content shall **not** transit the application server.
  - BR-MED-01.3 An upload that is not committed shall not appear in the media library.
  - BR-MED-01.4 Signed upload requests shall be rate limited to 50/hour/user.

### FR-MED-02 — Upload Constraints
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-MED-02.1 Allowed formats: `jpg, jpeg, png, webp, avif, svg`, plus `pdf` for attachments.
  - BR-MED-02.2 Maximum file size **5 MB**.
  - BR-MED-02.3 Minimum width **1200 px** for raster images used as covers (warning, not blocker, for inline images).
  - BR-MED-02.4 Server-side rejection messages shall state the actual value and the limit (e.g., *"File is 8.2 MB. Maximum is 5 MB."*).
  - BR-MED-02.5 SVG uploads shall be sanitized (scripts/foreignObject removed) before acceptance.

### FR-MED-03 — Mandatory Alt Text
- **Priority:** M · **Verification:** T, D
- **Description:** Every media asset shall require a non-empty `alt_text` (1–250 chars) at commit time; assets without alt text shall be visibly flagged in the library.
- **Business rules:** BR-MED-03.1 Decorative images may be explicitly marked decorative (`alt=""`), which is distinct from "missing".
- **Acceptance criteria:** Given an upload without alt text, when commit is invoked, then the request is rejected with a field-level error.

### FR-MED-04 — Media Library
- **Priority:** M · **Verification:** D
- **Description:** The library shall display assets as thumbnails with filename, dimensions, alt-text status, and usage indicator; support search by filename/alt text; and filter by used/unused.

### FR-MED-05 — Media Reuse & Detail
- **Priority:** M · **Verification:** D
- **Description:** Selecting an asset in the editor's image picker shall insert a reference to the existing asset (not a copy). The detail drawer shall show the `public_id`, dimensions, size, alt text, copyable URL, and the list of posts using it.

### FR-MED-06 — Media Deletion
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-MED-06.1 Deleting an asset in use shall require confirmation listing the affected posts.
  - BR-MED-06.2 Deletion removes the `media` record and the Cloudinary asset; affected posts retain a broken-reference-safe fallback (fixed aspect-ratio placeholder).
  - BR-MED-06.3 Authors may delete only their own assets; Editors/Owners may delete any.
  - BR-MED-06.4 Media attached to posts inside the 30-day restore window shall not be hard-deleted by the cleanup job.

### FR-MED-07 — Transformation Policy
- **Priority:** M · **Verification:** I, A
- **Description:** The system shall generate **exactly three** image variants: card (`w_800,h_450`), hero (`w_1600`), thumbnail (`w_200,h_200`), all with `c_fill,g_auto,f_auto,q_auto`.
- **Business rules:** BR-MED-07.1 No per-asset bespoke transformation strings shall be constructed in templates. BR-MED-07.2 A usage alert shall trigger at 80% of the monthly Cloudinary credit allowance and block new uploads at 95%.

### FR-MED-08 — Orphan Cleanup
- **Priority:** C · **Verification:** D
- **Description:** An Owner-triggered maintenance action shall list assets unused for ≥ 90 days and permit batch deletion after confirmation.

---

## 3.4 Module PUB — Public Site

### FR-PUB-01 — Home Page
- **Priority:** M · **Verification:** T, D
- **Description:** `/` shall present: a featured post (most recent published across all kinds), the five most recent published posts as a compact list, a latest-news card grid, a newsletter capture band, an ecosystem teaser row, and a changelog teaser.
- **Business rules:** BR-PUB-01.1 The featured post and first three list items shall be visible without scrolling at 1440×900. BR-PUB-01.2 Content shall be fully readable with JavaScript disabled.

### FR-PUB-02 — Hub Pages
- **Priority:** M · **Verification:** T
- **Description:** `/news`, `/newsletter`, `/ecosystem` shall present a hub heading, description, category filter pills, a featured horizontal card for the most recent item, a paginated card grid, and a newsletter capture band.

### FR-PUB-03 — Article Page
- **Priority:** M · **Verification:** T, D
- **Description:** `/{hub}/{slug}` shall render breadcrumb, category pill, H1, dek, author, publish date, reading time, cover image with caption, sanitized body, share actions, author bio, inline subscribe block, and related posts.
- **Business rules:**
  - BR-PUB-03.1 `<time datetime>` shall be present on all dates.
  - BR-PUB-03.2 Reading progress indicator shall be shown on articles exceeding 1,000 words.
  - BR-PUB-03.3 "On this page" navigation shall render only when the article has ≥ 3 H2 headings and viewport ≥ 1024px.
  - BR-PUB-03.4 A 404 shall be returned for unknown, draft, scheduled, soft-deleted, or archived slugs.

### FR-PUB-04 — Category Pages
- **Priority:** S · **Verification:** T
- **Description:** `/category/{slug}` shall list published posts in that category with the same card/pagination treatment as hubs; unknown categories return 404.

### FR-PUB-05 — Pagination
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-PUB-05.1 Page size: **12** items.
  - BR-PUB-05.2 Pagination uses a **Load more** control updating the URL to `/page/{n}`; infinite scroll is not used.
  - BR-PUB-05.3 Deep pagination uses keyset (cursor) queries, not `OFFSET`.

### FR-PUB-06 — Related Content
- **Priority:** S · **Verification:** T
- **Description:** Article pages shall show up to 3 related posts, selected by same category first, then same kind by recency, excluding the current post; if fewer than 3 qualify, fewer are shown and the block is omitted entirely at zero.

### FR-PUB-07 — Changelog
- **Priority:** M · **Verification:** D
- **Description:** `/changelog` shall present published changelog entries grouped by month, newest first, each carrying a type badge (`New`, `Improved`, `Fixed`, `Breaking`) rendered as **label + color**, never color alone.

### FR-PUB-08 — Search
- **Priority:** S · **Verification:** T, D
- **Description:** `/search?q=` shall return published posts ranked by Postgres `ts_rank` then recency, with query terms highlighted, result count, and pagination.
- **Business rules:**
  - BR-PUB-08.1 Queries < 2 characters return a prompt, not results.
  - BR-PUB-08.2 Zero results show the query echoed, 3 suggested recent posts, and a browse-all link.
  - BR-PUB-08.3 Search shall be rate limited to 30 requests/min/IP.
  - BR-PUB-08.4 Search results pages shall be `noindex`.

### FR-PUB-09 — RSS Feed
- **Priority:** M · **Verification:** T
- **Description:** `/rss.xml` shall return a valid RSS 2.0 feed of the 30 most recent published posts containing title, link, description, `pubDate`, and GUID.

### FR-PUB-10 — Sitemap
- **Priority:** M · **Verification:** T
- **Description:** `/sitemap.xml` shall list all published post URLs, hub pages, and category pages with `lastmod`; it shall exclude admin, preview, search, and unpublished content.

### FR-PUB-11 — robots.txt
- **Priority:** M · **Verification:** I
- **Description:** `/robots.txt` shall allow public content, disallow `/admin`, `/api`, `/search`, and preview paths, and reference the sitemap.

### FR-PUB-12 — Social & Structured Metadata
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-PUB-12.1 Every public page shall emit `<title>`, meta description, canonical URL, OpenGraph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`), and Twitter card tags.
  - BR-PUB-12.2 Article pages shall emit valid `Article` JSON-LD including `headline`, `datePublished`, `dateModified`, `author`, and `image`.

### FR-PUB-13 — Redirects
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-PUB-13.1 Slug changes on published posts create a 301 redirect from the previous path.
  - BR-PUB-13.2 Redirect chains shall be flattened to a single hop at write time.
  - BR-PUB-13.3 Redirects shall be resolvable without a database round trip on the hot path (edge/middleware lookup).
  - BR-PUB-13.4 Loop creation shall be prevented.

### FR-PUB-14 — Error Pages
- **Priority:** M · **Verification:** D
- **Description:** Custom 404 and 500 pages shall provide a plain explanation and navigation back to `/news` and `/`. Error pages shall not expose stack traces, environment variables, or internal identifiers.

### FR-PUB-15 — Progressive Enhancement
- **Priority:** M · **Verification:** T
- **Description:** All public content shall be readable and navigable with JavaScript disabled. Only the subscribe form and search input may progressively enhance.

### FR-PUB-16 — Theme Support
- **Priority:** C · **Verification:** D
- **Description:** The public site should honor `prefers-color-scheme` with an equivalent-contrast dark theme; the admin may remain light-only.

---

## 3.5 Module NEWS — Newsletter Subscriptions

### FR-NEWS-01 — Subscribe
- **Priority:** M · **Verification:** T, D
- **Description:** A visitor shall be able to subscribe with an email address from any of the four designated placements (header page, home band, article end, article sidebar).
- **Business rules:**
  - BR-NEWS-01.1 Only `email` is collected at signup. No name, no segmentation fields.
  - BR-NEWS-01.2 The response is **identical** whether the email is new, pending, or already confirmed (anti-enumeration).
  - BR-NEWS-01.3 A honeypot field and a minimum form-fill time shall silently discard bot submissions (return success, create nothing).
  - BR-NEWS-01.4 Rate limit: 3 requests/hour/IP.
  - BR-NEWS-01.5 Email shall be normalized (trim, lowercase) and stored as case-insensitive unique.

### FR-NEWS-02 — Double Opt-In
- **Priority:** M · **Verification:** T
- **Main flow:**
  1. Signup creates a subscriber with `status = pending` and a unique confirmation token.
  2. A confirmation email is sent within 60 seconds.
  3. The recipient clicks the link; the token is validated and consumed.
  4. Subscriber becomes `status = confirmed`, `confirmed_at` set.
  5. The visitor is shown a welcome page confirming subscription.
- **Business rules:**
  - BR-NEWS-02.1 Confirmation tokens are single-use and expire after **7 days**.
  - BR-NEWS-02.2 Pending subscribers shall never receive newsletter sends.
  - BR-NEWS-02.3 A pending subscriber who signs up again receives a fresh confirmation email (token rotated) without disclosing prior state.

### FR-NEWS-03 — Unsubscribe
- **Priority:** M · **Verification:** T
- **Description:** Every newsletter email shall contain a one-click unsubscribe link using a stable, non-guessable token; the link shall work **without authentication** and shall take effect immediately.
- **Business rules:** BR-NEWS-03.1 Unsubscribe sets `status = unsubscribed` and is never reversible by the subscriber's own re-subscribe without a fresh double opt-in. BR-NEWS-03.2 The unsubscribe page shall not require a confirmation click beyond the link itself.

### FR-NEWS-04 — Anti-Enumeration
- **Priority:** M · **Verification:** T
- **Description:** No endpoint (subscribe, confirm, unsubscribe, login) shall reveal whether an email address exists in the system, via response body, status code, or observable timing.

### FR-NEWS-05 — Subscriber Management
- **Priority:** M · **Verification:** D
- **Description:** Editor/Owner shall view a paginated subscriber list showing status, email, source, and join date, filterable by status, with summary counts (confirmed / pending / unsubscribed).

### FR-NEWS-06 — CSV Export
- **Priority:** M · **Verification:** T, D
- **Description:** Editor/Owner shall export the **currently filtered** subscriber set as CSV in one click, containing `email, status, source, confirmed_at, created_at`.
- **Business rules:** BR-NEWS-06.1 Export shall include only `confirmed` subscribers by default, with an explicit opt-in to include other statuses. BR-NEWS-06.2 Every export is audited (actor, row count, filter). BR-NEWS-06.3 Exports shall not be cached and shall be served with `no-store`.

### FR-NEWS-07 — Bulk Send Boundary
- **Priority:** M · **Verification:** I
- **Description:** The system **shall not** implement bulk newsletter delivery. Sending is delegated to an external ESP using the CSV export or a provider integration.
- **Rationale:** Deliverability, bounce/complaint handling, DMARC/SPF/DKIM, and CAN-SPAM/GDPR compliance are specialist concerns (SDD ADR-7).
- **Business rules:** BR-NEWS-07.1 Resend is used only for transactional email (magic links, confirmation, unsubscribe confirmation).

### FR-NEWS-08 — GDPR Data Subject Rights
- **Priority:** M · **Verification:** D
- **Business rules:**
  - BR-NEWS-08.1 Owner may delete a subscriber record on request; deletion removes PII and is audited.
  - BR-NEWS-08.2 Consent evidence (timestamp, source, IP where captured) shall be retained with the record until deletion.
  - BR-NEWS-08.3 The subscribe form shall link to the privacy notice.

---

## 3.6 Module ADM — Administration

### FR-ADM-01 — Dashboard
- **Priority:** S · **Verification:** D
- **Description:** `/admin` shall show counts (published, drafts, scheduled), the 5 most recently updated posts, upcoming scheduled posts with relative time, recent subscriber growth for 30 days, and recent audit entries (Owner only).

### FR-ADM-02 — Audit Log
- **Priority:** M · **Verification:** T, D
- **Description:** The system shall record an immutable audit entry for every state-changing action.
- **Business rules:**
  - BR-ADM-02.1 Recorded fields: `actor_id`, `action`, `entity_type`, `entity_id`, `diff` (before/after for mutations), `ip`, `user_agent`, `created_at`.
  - BR-ADM-02.2 Audited actions include: login success/failure, role change, user create/deactivate, post create/update/publish/unpublish/schedule/delete/restore, media upload/delete, subscriber export/delete, redirect create/delete, settings change.
  - BR-ADM-02.3 Audit entries are append-only; no UI or API path may update or delete them.
  - BR-ADM-02.4 Viewing is restricted to Owner.

### FR-ADM-03 — Redirect Management
- **Priority:** S · **Verification:** D
- **Description:** Editor/Owner may view, create, and delete redirects; creation validates against loops and duplicate sources.

### FR-ADM-04 — Settings
- **Priority:** S · **Verification:** D
- **Description:** Owner may configure site name, default OG image, social handles, contact email, newsletter frequency copy, and archived-post status code (404/410).

### FR-ADM-05 — Notifications & Feedback
- **Priority:** M · **Verification:** D
- **Business rules:**
  - BR-ADM-05.1 Save/publish outcomes surface as toasts (auto-dismiss 4 s, manually closable).
  - BR-ADM-05.2 Errors surface as persistent inline banners with a retry action.
  - BR-ADM-05.3 Toast containers shall use `aria-live` (`assertive` for errors, `polite` for success).

### FR-ADM-06 — State Handling
- **Priority:** M · **Verification:** D
- **Description:** Every data-bearing admin view shall implement explicit **loading** (skeleton matching final layout), **empty** (message + primary action), **error** (inline retry), and **permission-denied** (full-page message + back link) states.

### FR-ADM-07 — Keyboard Efficiency
- **Priority:** S · **Verification:** D
- **Business rules:** BR-ADM-07.1 `⌘S`/`Ctrl+S` saves; `⌘↵` publishes (with confirmation); `Esc` closes overlays. BR-ADM-07.2 All interactive elements are reachable and operable by keyboard.

### FR-ADM-08 — Responsive Admin
- **Priority:** S · **Verification:** D
- **Description:** At `<768px`, the admin shall present read-only post preview, status changes, and listing views, and shall display a notice that editing is optimized for larger screens. No destructive action shall be available on mobile without an additional confirmation step.

---

## 3.7 Module SYS — System Behavior

### FR-SYS-01 — Public Response Caching
- **Priority:** M · **Verification:** T, A
- **Description:** The system shall emit cache directives per route as specified in the design:

| Route class | `Cache-Control` |
|---|---|
| Home | `public, s-maxage=300, stale-while-revalidate=86400` |
| Hub lists | `public, s-maxage=120, stale-while-revalidate=86400` |
| Article | `public, s-maxage=3600, stale-while-revalidate=604800` |
| Changelog | `public, s-maxage=300, stale-while-revalidate=86400` |
| Feeds | `public, s-maxage=3600` |
| Search | `public, s-maxage=60` |
| Admin / API | `private, no-store` |
| Preview | `private, no-store` |

- **Acceptance criteria:** Given a cached article, when requested within the `s-maxage` window, then the response is served by the CDN with an `x-vercel-cache: HIT`-class header and does not invoke a function.

### FR-SYS-02 — Cache Invalidation
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-SYS-02.1 Publish/update/unpublish/delete shall trigger invalidation of the affected article path, list paths/tags, `/sitemap.xml`, and `/rss.xml`.
  - BR-SYS-02.2 Invalidation occurs **after** the database commit and **does not block** the response.
  - BR-SYS-02.3 Invalidation failure is logged and alerted; correctness degrades to TTL expiry, never to a failed write.
  - BR-SYS-02.4 If tag-based purge is unavailable on the hosting tier, list routes shall use TTL ≤ 120 s as the correctness mechanism.

### FR-SYS-03 — Rate Limiting (General)
- **Priority:** M · **Verification:** T

| Endpoint | Limit |
|---|---|
| Magic-link request | 5 / 15 min / IP and per email |
| Magic-link redemption | 10 / 15 min / IP |
| Subscribe | 3 / hour / IP |
| Search | 30 / min / IP |
| Media sign | 50 / hour / user |
| Mutation actions | 120 / hour / user |

- **Acceptance criteria:** Exceeding a limit returns HTTP 429 with `Retry-After` and a human-readable message.

### FR-SYS-04 — Global Error Handling
- **Priority:** M · **Verification:** T, I
- **Business rules:**
  - BR-SYS-04.1 Unhandled exceptions are captured, correlated by request ID, and reported to error tracking (Sentry or equivalent).
  - BR-SYS-04.2 Client-facing errors never include stack traces, SQL, file paths, or secrets.
  - BR-SYS-04.3 Failed mutations roll back fully; no partial writes.

### FR-SYS-05 — Logging
- **Priority:** M · **Verification:** I, D
- **Description:** Structured logs shall be emitted for every request (route, status, duration, cache status, request ID) and every mutation (actor, action, entity, outcome, duration). Logs shall never contain secrets, session tokens, full email bodies, or card data.

### FR-SYS-06 — Health & Readiness
- **Priority:** S · **Verification:** T
- **Description:** `/api/health` shall report application status and database reachability without authentication, exposing no sensitive detail, and shall be suitable for an uptime monitor at ≤ 1-minute interval.

### FR-SYS-07 — Scheduled Publishing Job
- **Priority:** M · **Verification:** T
- **Business rules:**
  - BR-SYS-07.1 Job runs at ≤ 1-minute interval via platform cron.
  - BR-SYS-07.2 Selects `status = scheduled AND scheduled_for <= now()`, publishes each in its own transaction.
  - BR-SYS-07.3 Concurrency-safe via row-level locking or conditional update; double-execution must not double-publish.
  - BR-SYS-07.4 Job execution and outcome are logged; failures alert.

### FR-SYS-08 — Data Backup
- **Priority:** M · **Verification:** D, A
- **Business rules:** BR-SYS-08.1 A nightly logical dump of the database is stored off-provider (object storage). BR-SYS-08.2 Restore procedure is documented and **tested quarterly**. BR-SYS-08.3 Cloudinary assets are not separately backed up; the `public_id` inventory in the DB is backed up.

---

## 3.8 Module SEC — Security Controls

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| **FR-SEC-01** | All responses shall set `Content-Security-Policy` with `default-src 'self'`, explicit `img-src` for Cloudinary, nonce-based `script-src`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'` | M | T, I |
| **FR-SEC-02** | All responses shall set `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` | M | T |
| **FR-SEC-03** | All responses shall set `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Permissions-Policy` | M | T |
| **FR-SEC-04** | All state-changing form actions shall enforce origin/CSRF validation; API routes shall validate `Origin`/`Referer` | M | T |
| **FR-SEC-05** | All user input shall be validated server-side against a schema (type, length, format) before use | M | T |
| **FR-SEC-06** | All database access shall be parameterized via the ORM; no string-concatenated SQL | M | I, T |
| **FR-SEC-07** | All rendered content shall pass through the sanitizer (FR-CMS-16); CSP provides defense-in-depth | M | T |
| **FR-SEC-08** | Secrets shall be stored only in platform environment variables; no secret shall use a client-exposed prefix; no secret shall be committed to the repository | M | I |
| **FR-SEC-09** | The application database role shall not hold `SUPERUSER` or DDL privileges; migrations run under a distinct role | M | I |
| **FR-SEC-10** | Editor embeds shall be restricted to an allowlisted domain set; server-side fetch of arbitrary user-supplied URLs is prohibited (SSRF) | M | T |
| **FR-SEC-11** | Dependency scanning and lockfile auditing shall run in CI on every change; critical vulnerabilities block deployment | M | I |
| **FR-SEC-12** | Uploaded SVGs shall be sanitized; uploads shall be validated by content, not only extension | M | T |
| **FR-SEC-13** | The admin area shall not be indexed and shall not be linked from public pages | M | I |
| **FR-SEC-14** | All authentication and authorization failures shall be logged with actor/IP and shall not disclose which condition failed | M | T |
| **FR-SEC-15** | Session cookies shall satisfy FR-AUTH-03.1 attributes; tokens shall be stored only as hashes | M | I, T |

---

# 4. External Interface Requirements

## 4.1 User Interfaces

| ID | Requirement |
|---|---|
| UI-01 | Public interfaces shall conform to UXD-NEWS-001 (layout, typography, color tokens, component inventory). |
| UI-02 | Admin interfaces shall conform to UXD-NEWS-001 §5 and use a 14px base with denser spacing than public pages. |
| UI-03 | All interfaces shall support viewports from 320px to 2560px without horizontal scrolling. |
| UI-04 | All interfaces shall meet WCAG 2.2 AA (see NFR-ACC). |
| UI-05 | Public pages shall render readable content without JavaScript (FR-PUB-15). |
| UI-06 | Focus shall be visible on every interactive element; the first tabbable element on every page shall be a skip-to-content link. |

## 4.2 Hardware Interfaces

None. No specialized hardware, no printers, no scanners. Standard client devices only.

## 4.3 Software Interfaces

| ID | External system | Interface | Direction | Data | Failure handling |
|---|---|---|---|---|---|
| SI-01 | **Neon Postgres** | TCP/TLS, SQL via Drizzle over pooled endpoint | Out | All structured data | Surface 503 to admin; serve stale public cache; alert |
| SI-02 | **Cloudinary Upload API** | HTTPS REST, signed parameters | Out | Image/PDF binaries | Block upload, show retry, preserve form state |
| SI-03 | **Cloudinary Admin API** | HTTPS REST | Out | Asset verification, deletion | Reject commit; log; alert |
| SI-04 | **Cloudinary Delivery CDN** | HTTPS | In (browser) | Transformed assets | Placeholder + preserved layout |
| SI-05 | **Resend API** | HTTPS REST | Out | Transactional email | Retry ×3 exponential; surface "check your email shortly"; alert |
| SI-06 | **Upstash Redis** | HTTPS REST | Out | Rate-limit counters, cache tags | **Fail-open** for rate limits with alerting (availability preferred), fail-closed for auth limits |
| SI-07 | **Vercel Cron** | Platform scheduler | In | Job trigger | Job re-runs next interval; alert on consecutive failures |
| SI-08 | **Error tracking (Sentry)** | HTTPS SDK | Out | Exceptions, request context | Non-blocking; silent on failure |
| SI-09 | **Neon–Vercel integration** | Platform | — | DB branch per preview | Preview falls back to read-only shared DB with a warning |

## 4.4 Communication Interfaces

| ID | Requirement |
|---|---|
| CI-01 | All client–server communication shall use HTTPS (TLS 1.2+); HTTP shall redirect to HTTPS. |
| CI-02 | The application shall function over HTTP/2 and HTTP/3. |
| CI-03 | Outbound transactional email shall use the provider's authenticated API (no SMTP relay). |
| CI-04 | Outbound requests to external services shall use timeouts (≤ 10 s) and bounded retries (≤ 3) with backoff. |
| CI-05 | All outbound calls shall be authenticated with provider-issued credentials stored as secrets. |

---

# 5. Non-Functional Requirements

## 5.1 Performance (NFR-PERF)

| ID | Requirement | Target | Verification |
|---|---|---|---|
| NFR-PERF-01 | Largest Contentful Paint, article page, p75, 4G | ≤ 1.2 s | A, T |
| NFR-PERF-02 | TTFB, cache HIT | ≤ 100 ms | A |
| NFR-PERF-03 | TTFB, cache MISS (cold function + warm DB) | ≤ 600 ms p95 | A |
| NFR-PERF-04 | Cumulative Layout Shift, all public pages | ≤ 0.05 | A |
| NFR-PERF-05 | Interaction to Next Paint | ≤ 200 ms | A |
| NFR-PERF-06 | JavaScript shipped, article page | ≤ 60 KB gzip | T (CI budget) |
| NFR-PERF-07 | CSS shipped | ≤ 25 KB gzip | T (CI budget) |
| NFR-PERF-08 | Database queries per public page render | ≤ 2 | I |
| NFR-PERF-09 | Autosave round trip (admin) | ≤ 800 ms p95 | T |
| NFR-PERF-10 | Admin list view interactive | ≤ 1.5 s p95 | T |
| NFR-PERF-11 | Font payload | ≤ 2 families, WOFF2, subset, ≤ 120 KB total | I |

## 5.2 Scalability (NFR-SCALE)

| ID | Requirement |
|---|---|
| NFR-SCALE-01 | The public read path shall sustain **100 peak RPS** without architecture change, with ≥ 95% of requests served from edge cache. |
| NFR-SCALE-02 | The system shall support **500,000 page views/month** on the specified hosting tier with acceptable performance. |
| NFR-SCALE-03 | The system shall support **50,000 posts** and **25,000 subscribers** without schema change. |
| NFR-SCALE-04 | All list endpoints shall be cursor-paginated; no unbounded result set shall be retrievable. |
| NFR-SCALE-05 | Scale-up shall require configuration changes only (tier upgrade), not code changes, up to 2M page views/month. |

## 5.3 Availability & Reliability (NFR-AVL)

| ID | Requirement |
|---|---|
| NFR-AVL-01 | Public read availability target: **99.9%** monthly, excluding planned maintenance. |
| NFR-AVL-02 | Admin availability target: **99.5%** monthly. |
| NFR-AVL-03 | Database unavailability shall not take down cached public pages; stale content shall be served. |
| NFR-AVL-04 | Media CDN unavailability shall degrade to placeholders preserving layout, not to broken layout. |
| NFR-AVL-05 | All mutations shall be atomic; no partial state shall be observable after a failure. |
| NFR-AVL-06 | Scheduled publishing shall be idempotent and recoverable after job failure. |
| NFR-AVL-07 | Recovery Point Objective (data): **≤ 24 h** via nightly dumps; **≤ 15 min** via provider PITR where available. |
| NFR-AVL-08 | Recovery Time Objective: **≤ 4 h** for full restoration. |

## 5.4 Security (NFR-SEC)

| ID | Requirement |
|---|---|
| NFR-SEC-01 | The application shall conform to **OWASP ASVS v4.0 Level 2**. |
| NFR-SEC-02 | No known critical or high severity vulnerabilities shall be present at release; CI shall block on critical. |
| NFR-SEC-03 | Dependency updates shall be reviewed at least monthly; critical patches applied within 72 hours. |
| NFR-SEC-04 | All secrets shall be rotatable without code change. |
| NFR-SEC-05 | Authentication and authorization shall be enforced server-side for every protected operation. |
| NFR-SEC-06 | The system shall not store passwords, payment data, or government identifiers. |
| NFR-SEC-07 | Error responses shall not disclose stack traces, SQL, internal paths, or version numbers. |
| NFR-SEC-08 | Penetration-style review of the admin surface shall be performed before public launch. |

## 5.5 Usability (NFR-USE)

| ID | Requirement |
|---|---|
| NFR-USE-01 | An Author shall be able to create and save a draft in **≤ 5 interactions** from login. |
| NFR-USE-02 | A returning reader shall identify "what is new" on the home page within **10 seconds** (usability test, n ≥ 5). |
| NFR-USE-03 | All destructive actions shall require confirmation naming the affected entity. |
| NFR-USE-04 | Every empty state shall offer a next action. |
| NFR-USE-05 | Every error message shall state what happened and what to do next. |
| NFR-USE-06 | No modal shall appear on page load on any public page. |

## 5.6 Accessibility (NFR-ACC)

| ID | Requirement |
|---|---|
| NFR-ACC-01 | All public and admin pages shall conform to **WCAG 2.2 Level AA**. |
| NFR-ACC-02 | Text contrast ≥ 4.5:1; large text and UI components ≥ 3:1. |
| NFR-ACC-03 | Status shall never be conveyed by color alone. |
| NFR-ACC-04 | All images shall have author-supplied alt text or be explicitly marked decorative. |
| NFR-ACC-05 | Every form control shall have a programmatically associated visible label. |
| NFR-ACC-06 | The full application shall be operable by keyboard; focus shall never be trapped except intentionally in modals. |
| NFR-ACC-07 | The application shall remain functional at 200% zoom and at 320px width. |
| NFR-ACC-08 | `prefers-reduced-motion` shall disable non-essential motion. |
| NFR-ACC-09 | Live regions shall announce async state changes (save status, toasts). |

## 5.7 Maintainability (NFR-MNT)

| ID | Requirement |
|---|---|
| NFR-MNT-01 | A single repository, single language (TypeScript), single deploy pipeline. |
| NFR-MNT-02 | ≥ 70% automated test coverage on server-side business logic (actions, sanitizer, auth guards). |
| NFR-MNT-03 | Every schema change shall be an additive, reviewed migration; no `push` against production. |
| NFR-MNT-04 | Public component library shall be documented with props and states. |
| NFR-MNT-05 | Environment onboarding (new developer to running system) shall take ≤ 1 day. |

## 5.8 Portability & Compliance (NFR-PORT / NFR-COMP)

| ID | Requirement |
|---|---|
| NFR-PORT-01 | Database access shall be confined to a data layer; ORM provider shall be swappable with changes localized to that layer. |
| NFR-PORT-02 | Media URLs shall be generated through a single helper, allowing CDN swap without template changes. |
| NFR-PORT-03 | The application shall not depend on provider-proprietary APIs for core content storage or retrieval. |
| NFR-COMP-01 | Subscriber handling shall satisfy GDPR (lawful basis, consent evidence, deletion, privacy notice). |
| NFR-COMP-02 | All commercial email shall satisfy CAN-SPAM (identification, physical address, working unsubscribe). |
| NFR-COMP-03 | A privacy policy and cookie notice shall be published and linked in the footer and subscribe forms. |
| NFR-COMP-04 | Hosting shall be on a plan that permits commercial use (Vercel Pro) before public launch. |

## 5.9 Cost (NFR-COST)

| ID | Requirement |
|---|---|
| NFR-COST-01 | Steady-state operating cost at launch shall be ≤ **US$25/month**. |
| NFR-COST-02 | Cloudinary credit consumption shall be monitored with alerts at 80% and blocking at 95%. |
| NFR-COST-03 | Neon compute consumption shall be monitored monthly with alerting at 80%. |

---

# 6. Data Requirements

## 6.1 Entities (Logical)

| Entity | Key attributes | Cardinality |
|---|---|---|
| `users` | id, email (unique, CI), name, role, email_verified, last_login_at | 1 → * posts, media, audit |
| `posts` | id, kind, slug (unique), title, excerpt, content_json, content_html, content_text, cover_media_id, category_id, author_id, status, published_at, scheduled_for, seo_*, reading_minutes, search_vector, deleted_at | * → 1 category, * → 1 cover media |
| `categories` | id, name, slug (unique) | 1 → * posts |
| `tags` / `post_tags` | tag name; join table | * ↔ * posts |
| `media` | id, public_id (unique), secure_url, format, width, height, bytes, alt_text, uploaded_by | 1 → * posts (as cover) |
| `revisions` | id, post_id, snapshot (JSON), created_by, created_at | * → 1 post |
| `subscribers` | id, email (unique, CI), status, source, confirm_token, unsubscribe_token, confirmed_at | standalone |
| `redirects` | from_path (PK), to_path, status | standalone |
| `audit_log` | id, actor_id, action, entity_type, entity_id, diff, ip, user_agent, created_at | * → 1 user |

## 6.2 Data Quality Rules

| ID | Rule |
|---|---|
| DQ-01 | All timestamps stored as `timestamptz` in UTC. |
| DQ-02 | Email addresses stored case-insensitively unique (`citext`). |
| DQ-03 | Slugs unique among non-deleted posts; reserved slugs rejected. |
| DQ-04 | `posts.status` constrained to the enumerated set; `kind` likewise. |
| DQ-05 | `posts.content_html` non-null on any saved post; derived from JSON at write time. |
| DQ-06 | `media.alt_text` non-null and non-empty unless `decorative = true`. |
| DQ-07 | `subscribers.confirmed_at` non-null if and only if status = confirmed. |
| DQ-08 | `published_at` non-null for status = published. |
| DQ-09 | Referential integrity enforced by foreign keys; user deletion shall not orphan posts (reassignment required). |

## 6.3 Retention

| Data | Retention |
|---|---|
| Published posts | Indefinite |
| Soft-deleted posts | 30 days, then eligible for hard delete |
| Revisions | Last 50 per post + all publish snapshots |
| Audit log | ≥ 24 months |
| Subscribers (unsubscribed) | Retained for suppression until deletion request |
| Pending subscribers (never confirmed) | Purged after 90 days |
| Application logs | Provider default (≥ 7 days); errors ≥ 30 days |
| Database backups | 30 days rolling |

## 6.4 Backup & Recovery

| ID | Requirement |
|---|---|
| DR-01 | Nightly logical database dump retained 30 days, stored off-provider. |
| DR-02 | Provider PITR enabled to the maximum available window for the tier. |
| DR-03 | Restore runbook exists and is exercised quarterly with a documented result. |
| DR-04 | Media recovery relies on the `media` table inventory; Cloudinary assets are assumed durable but not mirrored. |

## 6.5 Migration

| ID | Requirement |
|---|---|
| MG-01 | Schema changes follow expand → backfill → contract, in separate deploys. |
| MG-02 | Migrations run in CI against the unpooled endpoint **before** application deployment. |
| MG-03 | Every migration shall be reversible or paired with a documented forward-fix. |
| MG-04 | Preview deployments shall use an isolated database branch. |

---

# 7. System Behavior & States

## 7.1 Post Lifecycle State Machine

```
                ┌──────────────────────────────────────────┐
                │                                          │
   [create] ──► DRAFT ────publish──────────────► PUBLISHED │
                 │  ▲                              │   │    │
                 │  │                              │   │    │
     schedule ───┘  │ unpublish                    │   │    │
        │           └──────────────────────────────┘   │    │
        ▼                                              │    │
   SCHEDULED ────(cron: time reached)──► PUBLISHED ◄───┘    │
        │                                     │            │
        │ cancel                              │ archive    │
        └──────────► DRAFT                    ▼            │
                                          ARCHIVED ─────────┘
                                               │  restore
                                               ▼
                                             DRAFT

   Any state ──soft delete──► DELETED (deleted_at set)
   DELETED ──restore (Owner)──► previous state (within 30 days)
   DELETED ──hard delete (Owner)──► (purged)
```

**Transition rules:**

| From | To | Actor | Trigger | Side effects |
|---|---|---|---|---|
| — | draft | Author/Editor/Owner | Create | Audit, revision |
| draft | published | Editor/Owner | Publish | Audit, revision, cache purge, sitemap/RSS purge |
| draft | scheduled | Editor/Owner | Schedule | Audit |
| scheduled | draft | Editor/Owner | Cancel | Audit |
| scheduled | published | System | Cron time reached | Audit, cache purge |
| published | draft | Editor/Owner | Unpublish | Audit, cache purge |
| published | archived | Editor/Owner | Archive | Audit, cache purge (410 if configured) |
| archived | draft | Editor/Owner | Restore | Audit |
| any | deleted | Editor/Owner | Soft delete | Audit, cache purge |
| deleted | prior | Owner | Restore | Audit |
| deleted | — | Owner | Hard delete | Audit, permanent |

## 7.2 Subscriber Lifecycle

```
 [subscribe] ──► PENDING ──confirm──► CONFIRMED ──unsubscribe──► UNSUBSCRIBED
                    │                      │                            │
                    │ 90d no confirm       │ bounce (ESP reported)      │
                    ▼                      ▼                            │
                 (purged)               BOUNCED                         │
                                                                        │
                              re-subscribe (fresh double opt-in) ◄──────┘
```

## 7.3 Session Lifecycle

`anonymous → magic-link-requested → token-issued → authenticated (sliding 7d / absolute 30d) → expired | logged-out | revoked`

---

# 8. Constraints, Assumptions & Dependencies

See §2.5 (constraints) and §2.6 (assumptions/dependencies). Additional implementation constraints:

| ID | Constraint |
|---|---|
| C-13 | Rich-text editing is not supported below 768px viewport (explicit product decision). |
| C-14 | Search is Postgres-native only in v1; no external search engine. |
| C-15 | No background queue; all async work is either a platform cron or a request-scoped fire-and-forget with alerting. |
| C-16 | No server-side rendering of user-supplied HTML at request time; HTML is precomputed. |
| C-17 | English-language content only in v1; the schema must not encode language assumptions that block future i18n (no language-specific column names, slugs may contain unicode-safe transliteration). |

---

# 9. Verification & Acceptance

## 9.1 Verification Methods by Category

| Category | Method | Evidence |
|---|---|---|
| Functional (FR-*) | Automated integration tests + demonstration | Test reports, recorded demos |
| Performance (NFR-PERF) | Lighthouse CI, synthetic monitoring, load test | CI artifacts, dashboards |
| Security (FR-SEC, NFR-SEC) | Automated scan, header inspection, manual review, pre-launch assessment | Scan reports, checklist |
| Accessibility (NFR-ACC) | axe-core CI + manual keyboard/screen-reader pass | CI reports, audit checklist |
| Data (DR/MG) | Restore drill, migration dry-run | Drill record |
| Compliance | Document review | Privacy policy, email footer check |

## 9.2 Release Acceptance Criteria (Gate)

A release is acceptable only when **all** hold:

1. 100% of `MUST` requirements implemented and verified.
2. No open severity-1 or severity-2 defects.
3. CI green: type-check, lint, unit, integration, accessibility, JS/CSS budget.
4. Lighthouse on the article page: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (mobile).
5. Security headers verified on production.
6. Backup restore drill completed for the release cycle.
7. Commercial hosting plan confirmed (NFR-COMP-04).
8. Privacy policy, cookie notice, and unsubscribe flow verified end-to-end.

## 9.3 Key End-to-End Acceptance Scenarios

| ID | Scenario | Expected |
|---|---|---|
| E2E-01 | Owner creates Author; Author logs in, drafts, saves; Editor publishes | Post publicly visible; audit entries for create, update, publish |
| E2E-02 | Editor schedules a post 2 min ahead | Not visible before time; visible within 1 min after; cache purged |
| E2E-03 | Author attempts direct publish via crafted request | 403; no state change; logged |
| E2E-04 | Upload 8 MB image | Client/server rejects with size message; no media record created |
| E2E-05 | Upload valid image, omit alt text | Commit rejected; asset not listed |
| E2E-06 | Visitor subscribes, confirms, unsubscribes | Status transitions recorded; unsubscribe works without login |
| E2E-07 | Duplicate subscribe attempt | Identical response; no duplicate record; no enumeration leak |
| E2E-08 | Slug change on published post | Old URL 301s to new URL in one hop |
| E2E-09 | Submit `<script>alert(1)</script>` in editor body | Stripped at save; not rendered; no execution |
| E2E-10 | Read article with JavaScript disabled | Full content visible and navigable |
| E2E-11 | DB made unreachable; request cached article | Stale article served; no 5xx |
| E2E-12 | Cache purge fails during publish | Publish succeeds; alert raised; stale until TTL |
| E2E-13 | Keyboard-only: log in, create, save draft | Fully operable; focus visible throughout |
| E2E-14 | Screen reader on article and editor | Headings ordered, labels announced, status announced |
| E2E-15 | Owner deletes own account attempt (last owner) | Blocked with explanatory message |

---

# 10. Traceability Matrix (Summary)

| Requirement group | Source | Verification | Design reference |
|---|---|---|---|
| FR-AUTH-* | §2.3 personas, §2.5 C-11 | T, D, I | SDD §7; UXD §5.1 |
| FR-CMS-* | §2.2 F2, F3 | T, D | SDD §5, §6.3; UXD §5.3 |
| FR-MED-* | §2.2 F4, C-03, C-10 | T, D, I | SDD §8; UXD §5.4 |
| FR-PUB-* | §2.2 F1, F6 | T, D | SDD §4; UXD §3 |
| FR-NEWS-* | §2.2 F5, C-12 | T, D | SDD §9; UXD §4 |
| FR-ADM-* | §2.2 F7, F8 | T, D | SDD §6; UXD §5 |
| FR-SYS-* | §2.5 C-01..C-05 | T, A, D | SDD §4, §12 |
| FR-SEC-* | §2.5, R4, R5 | T, I | SDD §10 |
| NFR-PERF-* | §2.4, UXD §11 | A, T | SDD §11; UXD §12 |
| NFR-ACC-* | R3, UXD §9 | T, D | UXD §9 |
| NFR-COMP-* | R6, R8 | I | SDD §9 |

A full requirement-to-test-case mapping shall be maintained in the test management system and attached to each release.

---

# 11. Appendices

## Appendix A — Open Issues

| ID | Issue | Owner | Needed by |
|---|---|---|---|
| OI-01 | Confirm Vercel Pro procurement and billing owner | Operations | Before public launch |
| OI-02 | Select ESP for bulk delivery and confirm free-tier limits | Marketing | Before first newsletter send |
| OI-03 | Decide archived-post HTTP status (404 vs 410) | Product | Before FR-ADM-04 implementation |
| OI-04 | Confirm privacy policy and cookie notice text (legal review) | Legal | Before launch |
| OI-05 | Confirm whether dark mode ships in v1 (FR-PUB-16) | Product | Before UI freeze |
| OI-06 | Confirm Sentry vs alternative error tracker within budget | Engineering | Before Phase 6 |

## Appendix B — Glossary of Status Codes Used

| Code | Meaning in this document |
|---|---|
| 200 | Success |
| 301 | Permanent redirect (slug change) |
| 400 | Validation failure |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized |
| 404 | Not found / not published |
| 410 | Gone (archived, if configured) |
| 429 | Rate limited |
| 503 | Dependency unavailable |

## Appendix C — Requirement Count Summary

| Module | MUST | SHOULD | COULD | Total |
|---|---:|---:|---:|---:|
| AUTH | 8 | 1 | 1 | 10 |
| CMS | 15 | 3 | 2 | 20 |
| MED | 6 | 0 | 2 | 8 |
| PUB | 13 | 2 | 1 | 16 |
| NEWS | 7 | 0 | 0 | 8* |
| ADM | 4 | 4 | 0 | 8 |
| SYS | 7 | 1 | 0 | 8 |
| SEC | 15 | 0 | 0 | 15 |
| **Total FR** | **75** | **11** | **6** | **92** |
| **NFR** | — | — | — | **58** |
| **Grand total** | | | | **150** |

\* FR-NEWS-07 is a MUST *constraint* (prohibition) counted within the module.

---

**End of Document.**
