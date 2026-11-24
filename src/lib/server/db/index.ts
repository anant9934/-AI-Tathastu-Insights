import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

let databaseUrl = process.env.DATABASE_URL;
try {
	const { env } = await import('$env/dynamic/private');
	if (env?.DATABASE_URL) databaseUrl = env.DATABASE_URL;
} catch (e) {
	// Fallback to process.env in standalone test/script runners
}

if (!databaseUrl) {
	throw new Error('DATABASE_URL is not set');
}

const client = neon(databaseUrl);

export const db = drizzle(client, { schema });
