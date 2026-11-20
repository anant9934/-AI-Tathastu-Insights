CREATE TABLE "company_updates" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"detailed_explanation" text,
	"category" text DEFAULT 'Product Release' NOT NULL,
	"product_id" text,
	"version" text,
	"date" text NOT NULL,
	"author_name" text NOT NULL,
	"cover_image_url" text,
	"content_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tags_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related_links_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"milestone_metric_json" jsonb,
	"status" text DEFAULT 'published' NOT NULL,
	"published_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "company_updates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "engineering_articles" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"category" text DEFAULT 'System Architecture' NOT NULL,
	"abstract" text NOT NULL,
	"content_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"author_name" text NOT NULL,
	"author_role" text,
	"author_affiliation" text,
	"author_avatar_url" text,
	"reading_time_minutes" integer DEFAULT 6 NOT NULL,
	"cover_image_url" text,
	"tags_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"problem" text,
	"technical_context" text,
	"approach" text,
	"implementation" text,
	"challenges" text,
	"trade_offs" text,
	"outcome" text,
	"system_architecture_json" jsonb,
	"code_snippets_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"benchmarks_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related_product_id" text,
	"related_research_id" text,
	"status" text DEFAULT 'published' NOT NULL,
	"published_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "engineering_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "homepage_config" (
	"id" text PRIMARY KEY NOT NULL,
	"hero_headline" text NOT NULL,
	"hero_subtitle" text NOT NULL,
	"hero_description" text NOT NULL,
	"primary_cta_text" text DEFAULT 'Explore Systems' NOT NULL,
	"primary_cta_link" text DEFAULT '#products' NOT NULL,
	"secondary_cta_text" text DEFAULT 'Read Research' NOT NULL,
	"secondary_cta_link" text DEFAULT '#research' NOT NULL,
	"hero_media_url" text,
	"hero_media_type" text DEFAULT 'image',
	"featured_story_id" text,
	"featured_product_ids_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"featured_research_ids_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"featured_engineering_ids_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"featured_media_ids_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sections_config_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "navigation_menus" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"items_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_features" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tag" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"short_description" text NOT NULL,
	"full_description" text NOT NULL,
	"logo_url" text,
	"cover_image_url" text,
	"screenshots_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"accent_color" text DEFAULT 'blue' NOT NULL,
	"status" text DEFAULT 'Prototype' NOT NULL,
	"provenance_label" text DEFAULT 'Functional Demonstration' NOT NULL,
	"version" text DEFAULT '0.1.0' NOT NULL,
	"problem_solved" text,
	"why_exists" text,
	"target_audience" text,
	"proposed_solution" text,
	"product_value" text,
	"features_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"technical_architecture" text,
	"tech_stack_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"doc_links_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"website_url" text,
	"github_url" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"site_title" text DEFAULT 'AI Tathastu Insights' NOT NULL,
	"site_description" text DEFAULT 'Official publication, research archive, and engineering documentation of AI Tathastu.' NOT NULL,
	"brand_logo_url" text,
	"favicon_url" text,
	"contact_email" text DEFAULT 'editorial@tathastu-insights.org' NOT NULL,
	"social_links_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"default_seo_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"footer_config_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"theme_defaults_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "static_pages" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"template" text DEFAULT 'default' NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"featured_image_url" text,
	"seo_title" text,
	"seo_description" text,
	"status" text DEFAULT 'published' NOT NULL,
	"published_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "static_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "company_updates" ADD CONSTRAINT "company_updates_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engineering_articles" ADD CONSTRAINT "engineering_articles_related_product_id_products_id_fk" FOREIGN KEY ("related_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engineering_articles" ADD CONSTRAINT "engineering_articles_related_research_id_research_papers_id_fk" FOREIGN KEY ("related_research_id") REFERENCES "public"."research_papers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_features" ADD CONSTRAINT "product_features_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "company_updates_slug_idx" ON "company_updates" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "company_updates_status_idx" ON "company_updates" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "eng_articles_slug_idx" ON "engineering_articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "eng_articles_status_idx" ON "engineering_articles" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "static_pages_slug_idx" ON "static_pages" USING btree ("slug");