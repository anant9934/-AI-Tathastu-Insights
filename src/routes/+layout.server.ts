import type { LayoutServerLoad } from './$types';
import { db } from '#lib/server/db';
import { categories, settings } from '#lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals }) => {
	const allCategories = await db.query.categories.findMany({
		orderBy: [desc(categories.name)]
	});

	const allSettings = await db.query.settings.findMany();
	const config: Record<string, string> = {
		site_name: 'AI Tathastu Insights',
		site_description: 'Company news, newsletters, changelog, and ecosystem updates.'
	};
	for (const s of allSettings) {
		config[s.key] = s.value;
	}

	return {
		categories: allCategories,
		siteConfig: config,
		user: locals.user
	};
};
