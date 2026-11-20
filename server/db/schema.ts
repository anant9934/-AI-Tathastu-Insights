import { pgTable, text, timestamp, boolean, integer, numeric, jsonb, uuid, primaryKey, foreignKey, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. ROLES
export const roles = pgTable('roles', {
  id: text('id').primaryKey(), // 'super_admin' | 'editor' | 'research_editor' | 'author' | 'contributor'
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. PERMISSIONS
export const permissions = pgTable('permissions', {
  id: text('id').primaryKey(),
  roleId: text('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // 'read' | 'create' | 'update' | 'delete' | 'publish' | 'review'
  resource: text('resource').notNull(), // 'content' | 'manuscript' | 'review' | 'user' | 'media'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('permissions_role_idx').on(table.roleId),
]);

// 3. USERS
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  roleId: text('role_id').notNull().references(() => roles.id).default('contributor'),
  affiliation: text('affiliation'),
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('users_email_idx').on(table.email),
  index('users_role_idx').on(table.roleId),
]);

// 4. AUTHORS
export const authors = pgTable('authors', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  role: text('role').notNull(),
  affiliation: text('affiliation').notNull(),
  bio: text('bio').notNull(),
  avatarUrl: text('avatar_url'),
  orcid: text('orcid'),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 5. CATEGORIES
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  accentColor: text('accent_color').notNull().default('violet'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 6. TOPICS
export const topics = pgTable('topics', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  categoryId: text('category_id').references(() => categories.id),
  summary: text('summary').notNull(),
  status: text('status').notNull().default('Active Inquiry'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 7. TAGS
export const tags = pgTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

// 8. CONTENT
export const content = pgTable('content', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  abstract: text('abstract').notNull(),
  categoryId: text('category_id').notNull().references(() => categories.id),
  topicId: text('topic_id').references(() => topics.id),
  primaryAuthorId: text('primary_author_id').notNull().references(() => authors.id),
  publicationType: text('publication_type').notNull().default('Investigation'),
  status: text('status').notNull().default('draft'), 
  // 'draft' | 'submitted' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'revision_requested' | 'rejected' | 'archived'
  readingTimeMinutes: integer('reading_time_minutes').notNull().default(5),
  coverImageUrl: text('cover_image_url'),
  imageCaption: text('image_caption'),
  pullQuoteText: text('pull_quote_text'),
  pullQuoteAttribution: text('pull_quote_attribution'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isEditorsChoice: boolean('is_editors_choice').default(false).notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdById: text('created_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('content_status_idx').on(table.status),
  index('content_category_idx').on(table.categoryId),
  uniqueIndex('content_slug_idx').on(table.slug),
]);

// 9. CONTENT VERSIONS
export const contentVersions = pgTable('content_versions', {
  id: text('id').primaryKey(),
  contentId: text('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  abstract: text('abstract').notNull(),
  changelog: text('changelog'),
  createdById: text('created_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('content_versions_content_idx').on(table.contentId),
]);

// 10. CONTENT BLOCKS
export const contentBlocks = pgTable('content_blocks', {
  id: text('id').primaryKey(),
  contentId: text('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  blockType: text('block_type').notNull(), // 'paragraph' | 'heading' | 'figure' | 'code' | 'lemma' | 'chart'
  sortOrder: integer('sort_order').notNull(),
  contentJson: jsonb('content_json').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('content_blocks_sort_idx').on(table.contentId, table.sortOrder),
]);

// 11. RESEARCH PAPERS
export const researchPapers = pgTable('research_papers', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  doi: text('doi'),
  isDoiVerified: boolean('is_doi_verified').default(false).notNull(),
  doiVerificationSource: text('doi_verification_source'), // 'Crossref' | 'DataCite' | 'Unverified Demonstration'
  doiVerificationNotes: text('doi_verification_notes'),
  publicationType: text('publication_type').notNull().default('Preprint'),
  abstract: text('abstract').notNull(),
  authorsJson: jsonb('authors_json').notNull(), // Array of { name, role, affiliation, orcid? }
  categoryId: text('category_id').notNull().references(() => categories.id),
  publicationDate: text('publication_date').notNull(),
  publisher: text('publisher').notNull().default('AI Tathastu Insights Open Archive'),
  license: text('license').notNull().default('CC BY-NC 4.0'),
  sourceProvenance: text('source_provenance').notNull().default('demonstration_concept'),
  pdfAssetUrl: text('pdf_asset_url'),
  isDownloadAvailable: boolean('is_download_available').default(false).notNull(),
  bibtex: text('bibtex').notNull(),
  downloadCount: integer('download_count').default(0).notNull(),
  status: text('status').notNull().default('published'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('research_papers_doi_idx').on(table.doi),
  index('research_papers_status_idx').on(table.status),
]);

// 12. SOURCES
export const sources = pgTable('sources', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  baseUrl: text('base_url').notNull(),
  isAuthoritative: boolean('is_authoritative').default(true).notNull(),
  verificationProtocol: text('verification_protocol').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 13. CITATIONS
export const citations = pgTable('citations', {
  id: text('id').primaryKey(),
  contentId: text('content_id').references(() => content.id, { onDelete: 'cascade' }),
  paperId: text('paper_id').references(() => researchPapers.id, { onDelete: 'cascade' }),
  citationText: text('citation_text').notNull(),
  doi: text('doi'),
  isVerified: boolean('is_verified').default(false).notNull(),
  externalUrl: text('external_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 14. DATASETS
export const datasets = pgTable('datasets', {
  id: text('id').primaryKey(),
  paperId: text('paper_id').references(() => researchPapers.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  format: text('format').notNull(),
  sizeBytes: integer('size_bytes'),
  accessTier: text('access_tier').notNull().default('open'), // 'open' | 'registered' | 'restricted'
  hashSha256: text('hash_sha256'),
  downloadUrl: text('download_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 15. MEDIA ASSETS
export const mediaAssets = pgTable('media_assets', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  format: text('format').notNull(), // 'documentary' | 'dialogue' | 'lecture'
  durationSeconds: integer('duration_seconds').notNull(),
  durationLabel: text('duration_label').notNull(),
  speaker: text('speaker').notNull(),
  speakerRole: text('speaker_role').notNull(),
  description: text('description').notNull(),
  coverImageUrl: text('cover_image_url').notNull(),
  streamUrl: text('stream_url'),
  isStreamAvailable: boolean('is_stream_available').default(false).notNull(),
  transcriptText: text('transcript_text'),
  fileSizeBytes: integer('file_size_bytes'),
  mimeType: text('mime_type'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 16. MANUSCRIPT SUBMISSIONS
export const manuscriptSubmissions = pgTable('manuscript_submissions', {
  id: text('id').primaryKey(), // 'sub-2026-***'
  title: text('title').notNull(),
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email').notNull(),
  authorAffiliation: text('author_affiliation').notNull(),
  categoryId: text('category_id').notNull().references(() => categories.id),
  abstract: text('abstract').notNull(),
  wordCount: integer('word_count').notNull(),
  manuscriptFileUrl: text('manuscript_file_url'),
  status: text('status').notNull().default('submitted'), 
  // 'submitted' | 'in_review' | 'revision_requested' | 'approved' | 'rejected' | 'archived'
  assignedEditorId: text('assigned_editor_id').references(() => users.id),
  reproducibilityAttestation: boolean('reproducibility_attestation').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('manuscript_status_idx').on(table.status),
  index('manuscript_editor_idx').on(table.assignedEditorId),
]);

// 17. EDITORIAL REVIEWS
export const editorialReviews = pgTable('editorial_reviews', {
  id: text('id').primaryKey(),
  submissionId: text('submission_id').notNull().references(() => manuscriptSubmissions.id, { onDelete: 'cascade' }),
  reviewerId: text('reviewer_id').notNull().references(() => users.id),
  stage: text('stage').notNull().default('peer_review'), // 'initial_screening' | 'peer_review' | 'ethics_check' | 'editorial_decision'
  score: numeric('score', { precision: 3, scale: 1 }), // 1.0 - 10.0
  recommendation: text('recommendation').notNull(), // 'accept' | 'minor_revisions' | 'major_revisions' | 'reject'
  commentsForAuthor: text('comments_for_author').notNull(),
  confidentialComments: text('confidential_comments'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('reviews_submission_idx').on(table.submissionId),
  index('reviews_reviewer_idx').on(table.reviewerId),
]);

// 18. PUBLICATION EVENTS (AUDIT TRAIL FOR EDITORIAL LIFECYCLE)
export const publicationEvents = pgTable('publication_events', {
  id: text('id').primaryKey(),
  contentId: text('content_id').references(() => content.id, { onDelete: 'cascade' }),
  submissionId: text('submission_id').references(() => manuscriptSubmissions.id, { onDelete: 'cascade' }),
  eventType: text('event_type').notNull(), // 'submitted' | 'review_assigned' | 'review_completed' | 'revision_requested' | 'approved' | 'scheduled' | 'published' | 'rejected' | 'archived'
  actorId: text('actor_id').notNull().references(() => users.id),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('pub_events_content_idx').on(table.contentId),
  index('pub_events_submission_idx').on(table.submissionId),
]);

// 19. BOOKMARKS
export const bookmarks = pgTable('bookmarks', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sessionId: text('session_id'), // For unauthenticated guest synchronization
  articleId: text('article_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('bookmarks_user_idx').on(table.userId),
  index('bookmarks_session_idx').on(table.sessionId),
]);

// 20. NEWSLETTER SUBSCRIBERS
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  isConfirmed: boolean('is_confirmed').default(false).notNull(),
  confirmationToken: text('confirmation_token').notNull(),
  consentRecordedAt: timestamp('consent_recorded_at', { withTimezone: true }).defaultNow().notNull(),
  unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
  ipHash: text('ip_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('newsletter_email_idx').on(table.email),
]);

// 21. AUDIT LOGS
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(), // e.g. 'auth:login' | 'content:publish' | 'manuscript:status_update'
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id'),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('audit_logs_user_idx').on(table.userId),
  index('audit_logs_action_idx').on(table.action),
]);

// 22. PRODUCTS
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  tagline: text('tagline').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  logoUrl: text('logo_url'),
  coverImageUrl: text('cover_image_url'),
  screenshotsJson: jsonb('screenshots_json').notNull().default([]),
  accentColor: text('accent_color').notNull().default('blue'),
  status: text('status').notNull().default('Prototype'), // 'Live Platform' | 'Beta Lab' | 'Prototype' | 'In Development' | 'Planned' | 'Discontinued'
  provenanceLabel: text('provenance_label').notNull().default('Functional Demonstration'),
  version: text('version').notNull().default('0.1.0'),
  problemSolved: text('problem_solved'),
  whyExists: text('why_exists'),
  targetAudience: text('target_audience'),
  proposedSolution: text('proposed_solution'),
  productValue: text('product_value'),
  featuresJson: jsonb('features_json').notNull().default([]),
  technicalArchitecture: text('technical_architecture'),
  techStackJson: jsonb('tech_stack_json').notNull().default([]),
  docLinksJson: jsonb('doc_links_json').notNull().default([]),
  websiteUrl: text('website_url'),
  githubUrl: text('github_url'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('products_slug_idx').on(table.slug),
  index('products_status_idx').on(table.status),
]);

// 23. PRODUCT FEATURES
export const productFeatures = pgTable('product_features', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  tag: text('tag'),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 24. ENGINEERING ARTICLES
export const engineeringArticles = pgTable('engineering_articles', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  category: text('category').notNull().default('System Architecture'),
  abstract: text('abstract').notNull(),
  contentJson: jsonb('content_json').notNull().default([]),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role'),
  authorAffiliation: text('author_affiliation'),
  authorAvatarUrl: text('author_avatar_url'),
  readingTimeMinutes: integer('reading_time_minutes').default(6).notNull(),
  coverImageUrl: text('cover_image_url'),
  tagsJson: jsonb('tags_json').notNull().default([]),
  problem: text('problem'),
  technicalContext: text('technical_context'),
  approach: text('approach'),
  implementation: text('implementation'),
  challenges: text('challenges'),
  tradeOffs: text('trade_offs'),
  outcome: text('outcome'),
  systemArchitectureJson: jsonb('system_architecture_json'),
  codeSnippetsJson: jsonb('code_snippets_json').notNull().default([]),
  benchmarksJson: jsonb('benchmarks_json').notNull().default([]),
  relatedProductId: text('related_product_id').references(() => products.id, { onDelete: 'set null' }),
  relatedResearchId: text('related_research_id').references(() => researchPapers.id, { onDelete: 'set null' }),
  status: text('status').notNull().default('published'), // 'draft' | 'in_review' | 'published' | 'archived'
  publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('eng_articles_slug_idx').on(table.slug),
  index('eng_articles_status_idx').on(table.status),
]);

// 25. COMPANY UPDATES / CHANGELOG
export const companyUpdates = pgTable('company_updates', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  detailedExplanation: text('detailed_explanation'),
  category: text('category').notNull().default('Product Release'),
  productId: text('product_id').references(() => products.id, { onDelete: 'set null' }),
  version: text('version'),
  date: text('date').notNull(),
  authorName: text('author_name').notNull(),
  coverImageUrl: text('cover_image_url'),
  contentJson: jsonb('content_json').notNull().default([]),
  tagsJson: jsonb('tags_json').notNull().default([]),
  relatedLinksJson: jsonb('related_links_json').notNull().default([]),
  milestoneMetricJson: jsonb('milestone_metric_json'),
  status: text('status').notNull().default('published'), // 'draft' | 'published' | 'archived'
  publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('company_updates_slug_idx').on(table.slug),
  index('company_updates_status_idx').on(table.status),
]);

// 26. STATIC PAGES
export const staticPages = pgTable('static_pages', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  template: text('template').notNull().default('default'),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImageUrl: text('featured_image_url'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  status: text('status').notNull().default('published'), // 'draft' | 'published'
  publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('static_pages_slug_idx').on(table.slug),
]);

// 27. NAVIGATION MENUS
export const navigationMenus = pgTable('navigation_menus', {
  id: text('id').primaryKey(), // 'main' | 'footer' | 'product'
  name: text('name').notNull(),
  itemsJson: jsonb('items_json').notNull().default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 28. HOMEPAGE CONFIG
export const homepageConfig = pgTable('homepage_config', {
  id: text('id').primaryKey(), // 'default'
  heroHeadline: text('hero_headline').notNull(),
  heroSubtitle: text('hero_subtitle').notNull(),
  heroDescription: text('hero_description').notNull(),
  primaryCtaText: text('primary_cta_text').notNull().default('Explore Systems'),
  primaryCtaLink: text('primary_cta_link').notNull().default('#products'),
  secondaryCtaText: text('secondary_cta_text').notNull().default('Read Research'),
  secondaryCtaLink: text('secondary_cta_link').notNull().default('#research'),
  heroMediaUrl: text('hero_media_url'),
  heroMediaType: text('hero_media_type').default('image'),
  featuredStoryId: text('featured_story_id'),
  featuredProductIdsJson: jsonb('featured_product_ids_json').notNull().default([]),
  featuredResearchIdsJson: jsonb('featured_research_ids_json').notNull().default([]),
  featuredEngineeringIdsJson: jsonb('featured_engineering_ids_json').notNull().default([]),
  featuredMediaIdsJson: jsonb('featured_media_ids_json').notNull().default([]),
  sectionsConfigJson: jsonb('sections_config_json').notNull().default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 29. SITE SETTINGS
export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey(), // 'default'
  siteTitle: text('site_title').notNull().default('AI Tathastu Insights'),
  siteDescription: text('site_description').notNull().default('Official publication, research archive, and engineering documentation of AI Tathastu.'),
  brandLogoUrl: text('brand_logo_url'),
  faviconUrl: text('favicon_url'),
  contactEmail: text('contact_email').notNull().default('editorial@tathastu-insights.org'),
  socialLinksJson: jsonb('social_links_json').notNull().default([]),
  defaultSeoJson: jsonb('default_seo_json').notNull().default({}),
  footerConfigJson: jsonb('footer_config_json').notNull().default({}),
  themeDefaultsJson: jsonb('theme_defaults_json').notNull().default({}),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// RELATIONS DEFINITIONS FOR DRIZZLE ORM
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, { fields: [users.roleId], references: [roles.id] }),
  content: many(content),
  reviews: many(editorialReviews),
  submissions: many(manuscriptSubmissions),
  bookmarks: many(bookmarks),
}));

export const contentRelations = relations(content, ({ one, many }) => ({
  category: one(categories, { fields: [content.categoryId], references: [categories.id] }),
  topic: one(topics, { fields: [content.topicId], references: [topics.id] }),
  author: one(authors, { fields: [content.primaryAuthorId], references: [authors.id] }),
  creator: one(users, { fields: [content.createdById], references: [users.id] }),
  versions: many(contentVersions),
  blocks: many(contentBlocks),
  citations: many(citations),
  events: many(publicationEvents),
}));

export const manuscriptSubmissionsRelations = relations(manuscriptSubmissions, ({ one, many }) => ({
  category: one(categories, { fields: [manuscriptSubmissions.categoryId], references: [categories.id] }),
  assignedEditor: one(users, { fields: [manuscriptSubmissions.assignedEditorId], references: [users.id] }),
  reviews: many(editorialReviews),
  events: many(publicationEvents),
}));
