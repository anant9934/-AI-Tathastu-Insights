import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '#lib/server/db';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	const startTime = Date.now();
	let dbStatus = 'ok';
	let dbLatencyMs = 0;

	try {
		const res = await db.execute(sql`SELECT 1 as ping`);
		dbLatencyMs = Date.now() - startTime;
	} catch (err) {
		dbStatus = 'unreachable';
		return json(
			{
				status: 'error',
				service: 'ai-tathastu-insights',
				database: dbStatus,
				timestamp: new Date().toISOString()
			},
			{ status: 503 }
		);
	}

	return json({
		status: 'healthy',
		service: 'ai-tathastu-insights',
		database: dbStatus,
		latencyMs: dbLatencyMs,
		timestamp: new Date().toISOString()
	});
};
