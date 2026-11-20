CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text,
	"details" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"affiliation" text NOT NULL,
	"bio" text NOT NULL,
	"avatar_url" text,
	"orcid" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"session_id" text,
	"article_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"accent_color" text DEFAULT 'violet' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "citations" (
	"id" text PRIMARY KEY NOT NULL,
	"content_id" text,
	"paper_id" text,
	"citation_text" text NOT NULL,
	"doi" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"external_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"abstract" text NOT NULL,
	"category_id" text NOT NULL,
	"topic_id" text,
	"primary_author_id" text NOT NULL,
	"publication_type" text DEFAULT 'Investigation' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"reading_time_minutes" integer DEFAULT 5 NOT NULL,
	"cover_image_url" text,
	"image_caption" text,
	"pull_quote_text" text,
	"pull_quote_attribution" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_editors_choice" boolean DEFAULT false NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "content_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"content_id" text NOT NULL,
	"block_type" text NOT NULL,
	"sort_order" integer NOT NULL,
	"content_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"content_id" text NOT NULL,
	"version_number" integer NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"abstract" text NOT NULL,
	"changelog" text,
	"created_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "datasets" (
	"id" text PRIMARY KEY NOT NULL,
	"paper_id" text,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"format" text NOT NULL,
	"size_bytes" integer,
	"access_tier" text DEFAULT 'open' NOT NULL,
	"hash_sha256" text,
	"download_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "editorial_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"submission_id" text NOT NULL,
	"reviewer_id" text NOT NULL,
	"stage" text DEFAULT 'peer_review' NOT NULL,
	"score" numeric(3, 1),
	"recommendation" text NOT NULL,
	"comments_for_author" text NOT NULL,
	"confidential_comments" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manuscript_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author_name" text NOT NULL,
	"author_email" text NOT NULL,
	"author_affiliation" text NOT NULL,
	"category_id" text NOT NULL,
	"abstract" text NOT NULL,
	"word_count" integer NOT NULL,
	"manuscript_file_url" text,
	"status" text DEFAULT 'submitted' NOT NULL,
	"assigned_editor_id" text,
	"reproducibility_attestation" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"format" text NOT NULL,
	"duration_seconds" integer NOT NULL,
	"duration_label" text NOT NULL,
	"speaker" text NOT NULL,
	"speaker_role" text NOT NULL,
	"description" text NOT NULL,
	"cover_image_url" text NOT NULL,
	"stream_url" text,
	"is_stream_available" boolean DEFAULT false NOT NULL,
	"transcript_text" text,
	"file_size_bytes" integer,
	"mime_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"is_confirmed" boolean DEFAULT false NOT NULL,
	"confirmation_token" text NOT NULL,
	"consent_recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"role_id" text NOT NULL,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publication_events" (
	"id" text PRIMARY KEY NOT NULL,
	"content_id" text,
	"submission_id" text,
	"event_type" text NOT NULL,
	"actor_id" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_papers" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"doi" text,
	"is_doi_verified" boolean DEFAULT false NOT NULL,
	"doi_verification_source" text,
	"doi_verification_notes" text,
	"publication_type" text DEFAULT 'Preprint' NOT NULL,
	"abstract" text NOT NULL,
	"authors_json" jsonb NOT NULL,
	"category_id" text NOT NULL,
	"publication_date" text NOT NULL,
	"publisher" text DEFAULT 'AI Tathastu Insights Open Archive' NOT NULL,
	"license" text DEFAULT 'CC BY-NC 4.0' NOT NULL,
	"source_provenance" text DEFAULT 'demonstration_concept' NOT NULL,
	"pdf_asset_url" text,
	"is_download_available" boolean DEFAULT false NOT NULL,
	"bibtex" text NOT NULL,
	"download_count" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "research_papers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"base_url" text NOT NULL,
	"is_authoritative" boolean DEFAULT true NOT NULL,
	"verification_protocol" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category_id" text,
	"summary" text NOT NULL,
	"status" text DEFAULT 'Active Inquiry' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "topics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role_id" text DEFAULT 'contributor' NOT NULL,
	"affiliation" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_article_id_content_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citations" ADD CONSTRAINT "citations_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citations" ADD CONSTRAINT "citations_paper_id_research_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."research_papers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content" ADD CONSTRAINT "content_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content" ADD CONSTRAINT "content_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content" ADD CONSTRAINT "content_primary_author_id_authors_id_fk" FOREIGN KEY ("primary_author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content" ADD CONSTRAINT "content_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_blocks" ADD CONSTRAINT "content_blocks_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "datasets" ADD CONSTRAINT "datasets_paper_id_research_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."research_papers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editorial_reviews" ADD CONSTRAINT "editorial_reviews_submission_id_manuscript_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."manuscript_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editorial_reviews" ADD CONSTRAINT "editorial_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manuscript_submissions" ADD CONSTRAINT "manuscript_submissions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manuscript_submissions" ADD CONSTRAINT "manuscript_submissions_assigned_editor_id_users_id_fk" FOREIGN KEY ("assigned_editor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_events" ADD CONSTRAINT "publication_events_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_events" ADD CONSTRAINT "publication_events_submission_id_manuscript_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."manuscript_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_events" ADD CONSTRAINT "publication_events_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_papers" ADD CONSTRAINT "research_papers_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_user_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "bookmarks_user_idx" ON "bookmarks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "bookmarks_session_idx" ON "bookmarks" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "content_status_idx" ON "content" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_category_idx" ON "content" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "content_slug_idx" ON "content" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "content_blocks_sort_idx" ON "content_blocks" USING btree ("content_id","sort_order");--> statement-breakpoint
CREATE INDEX "content_versions_content_idx" ON "content_versions" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "reviews_submission_idx" ON "editorial_reviews" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "reviews_reviewer_idx" ON "editorial_reviews" USING btree ("reviewer_id");--> statement-breakpoint
CREATE INDEX "manuscript_status_idx" ON "manuscript_submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "manuscript_editor_idx" ON "manuscript_submissions" USING btree ("assigned_editor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_email_idx" ON "newsletter_subscribers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "permissions_role_idx" ON "permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "pub_events_content_idx" ON "publication_events" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "pub_events_submission_idx" ON "publication_events" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "research_papers_doi_idx" ON "research_papers" USING btree ("doi");--> statement-breakpoint
CREATE INDEX "research_papers_status_idx" ON "research_papers" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role_id");