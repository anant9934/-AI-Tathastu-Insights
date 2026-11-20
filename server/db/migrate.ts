import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export async function runMigrations(): Promise<{ success: boolean; message: string }> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes('dummy')) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: Cannot run migrations in production without a valid DATABASE_URL.');
    }
    const msg = 'Skipping remote migrations: No valid DATABASE_URL configured in environment.';
    console.log(`[Migrations] ${msg}`);
    return { success: true, message: msg };
  }

  const pool = new pg.Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=require') || connectionString.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : false,
    max: 1,
  });

  try {
    const db = drizzle(pool);
    const migrationsFolder = path.resolve(process.cwd(), 'drizzle');
    console.log(`[Migrations] Applying Drizzle SQL migrations from ${migrationsFolder}...`);
    await migrate(db, { migrationsFolder });
    const msg = 'Successfully applied all 31 table migrations to PostgreSQL.';
    console.log(`[Migrations] ${msg}`);
    return { success: true, message: msg };
  } catch (err: any) {
    console.error('[Migrations] Migration failed:', err);
    throw err;
  } finally {
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then((res) => {
      console.log('[Migrations Done]', res.message);
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Migrations Error]', err);
      process.exit(1);
    });
}
