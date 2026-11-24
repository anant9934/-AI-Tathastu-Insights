import { pgTable, text, timestamp, boolean, integer, jsonb, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['viewer', 'author', 'editor', 'owner']);
export const postKindEnum = pgEnum('post_kind', ['article', 'announcement', 'newsletter', 'changelog']);
export const postStatusEnum = pgEnum('post_status', ['draft', 'scheduled', 'published', 'archived']);
export const changelogTypeEnum = pgEnum('changelog_type', ['new', 'improved', 'fixed', 'breaking']);
export const subscriberStatusEnum = pgEnum('subscriber_status', ['pending', 'confirmed', 'unsubscribed', 'bounced']);

// 1. Users
export const users = pgTable('users', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	role: userRoleEnum('role').notNull().default('viewer'),
	emailVerified: boolean('email_verified').notNull().default(false),
	lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
	deactivated: boolean('deactivated').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

// 2. Auth Tokens (Magic Links)
export const authTokens = pgTable('auth_tokens', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	tokenHash: text('token_hash').notNull().unique(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	usedAt: timestamp('used_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// 3. Sessions
export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(), // Session token hash
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// 4. Categories
export const categories = pgTable('categories', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// 5. Media
export const media = pgTable('media', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	publicId: text('public_id').notNull().unique(),
	secureUrl: text('secure_url').notNull(),
	format: text('format').notNull(),
	width: integer('width').notNull(),
	height: integer('height').notNull(),
	bytes: integer('bytes').notNull(),
	altText: text('alt_text').notNull().default(''),
	decorative: boolean('decorative').notNull().default(false),
	uploadedBy: text('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// 6. Posts
export const posts = pgTable('posts', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	kind: postKindEnum('kind').notNull().default('article'),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	excerpt: text('excerpt'),
	contentJson: jsonb('content_json'),
	contentHtml: text('content_html').notNull().default(''),
	contentText: text('content_text').notNull().default(''),
	coverMediaId: text('cover_media_id').references(() => media.id, { onDelete: 'set null' }),
	categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
	authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
	status: postStatusEnum('status').notNull().default('draft'),
	publishedAt: timestamp('published_at', { withTimezone: true }),
	scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
	seoTitle: text('seo_title'),
	seoDescription: text('seo_description'),
	readingMinutes: integer('reading_minutes').notNull().default(1),
	changelogType: changelogTypeEnum('changelog_type'),
	deletedAt: timestamp('deleted_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

// 7. Tags
export const tags = pgTable('tags', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// 8. Post Tags
export const postTags = pgTable('post_tags', {
	postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
	tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' })
}, (table) => [
	primaryKey({ columns: [table.postId, table.tagId] })
]);

// 9. Revisions
export const revisions = pgTable('revisions', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
	snapshot: jsonb('snapshot').notNull(),
	createdBy: text('created_by').references(() => users.id, { onDelete: 'set null' }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// 10. Subscribers
export const subscribers = pgTable('subscribers', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	email: text('email').notNull().unique(),
	status: subscriberStatusEnum('status').notNull().default('pending'),
	source: text('source').notNull().default('website'),
	confirmToken: text('confirm_token'),
	confirmTokenExpiresAt: timestamp('confirm_token_expires_at', { withTimezone: true }),
	unsubscribeToken: text('unsubscribe_token').notNull(),
	confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// 11. Redirects
export const redirects = pgTable('redirects', {
	fromPath: text('from_path').primaryKey(),
	toPath: text('to_path').notNull(),
	status: integer('status').notNull().default(301),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// 12. Audit Log
export const auditLog = pgTable('audit_log', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	actorId: text('actor_id').references(() => users.id, { onDelete: 'set null' }),
	action: text('action').notNull(),
	entityType: text('entity_type').notNull(),
	entityId: text('entity_id'),
	diff: jsonb('diff'),
	ip: text('ip'),
	userAgent: text('user_agent'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// 13. Settings
export const settings = pgTable('settings', {
	key: text('key').primaryKey(),
	value: text('value').notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	media: many(media),
	auditLogs: many(auditLog)
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id]
	}),
	category: one(categories, {
		fields: [posts.categoryId],
		references: [categories.id]
	}),
	coverMedia: one(media, {
		fields: [posts.coverMediaId],
		references: [media.id]
	}),
	postTags: many(postTags),
	revisions: many(revisions)
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	posts: many(posts)
}));

export const mediaRelations = relations(media, ({ one, many }) => ({
	uploader: one(users, {
		fields: [media.uploadedBy],
		references: [users.id]
	}),
	posts: many(posts)
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
	post: one(posts, {
		fields: [postTags.postId],
		references: [posts.id]
	}),
	tag: one(tags, {
		fields: [postTags.tagId],
		references: [tags.id]
	})
}));

export const revisionsRelations = relations(revisions, ({ one }) => ({
	post: one(posts, {
		fields: [revisions.postId],
		references: [posts.id]
	}),
	creator: one(users, {
		fields: [revisions.createdBy],
		references: [users.id]
	})
}));
