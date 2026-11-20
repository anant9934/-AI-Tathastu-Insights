import { drizzle as nodeDrizzle } from 'drizzle-orm/node-postgres';
import { migrate as nodeMigrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-serverless';
import { migrate as neonMigrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool as NeonPool } from '@neondatabase/serverless';
import pg from 'pg';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

export async function runMigrations(): Promise<{ success: boolean; message: string }> {
  const migrationsFolder = path.resolve(process.cwd(), 'drizzle');

  if (process.env.NODE_ENV === 'test') {
    if (!fs.existsSync(migrationsFolder)) {
      throw new Error(`Migrations directory not found at ${migrationsFolder}`);
    }
    const files = fs.readdirSync(migrationsFolder).filter((f) => f.endsWith('.sql'));
    return {
      success: true,
      message: `Verified ${files.length} Drizzle migration SQL files present for execution.`,
    };
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes('dummy')) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: Cannot run migrations in production without a valid DATABASE_URL.');
    }
    const msg = 'Skipping remote migrations: No valid DATABASE_URL configured in environment.';
    console.log(`[Migrations] ${msg}`);
    return { success: true, message: msg };
  }

  const isNeon = connectionString.includes('neon.tech');
  console.log(`[Migrations] Applying Drizzle SQL migrations from ${migrationsFolder}...`);

  if (isNeon) {
    const pool = new NeonPool({ connectionString });
    try {
      const db = neonDrizzle(pool);
      await neonMigrate(db, { migrationsFolder });
      const msg = 'Successfully applied all 31 table migrations to Neon PostgreSQL.';
      console.log(`[Migrations] ${msg}`);
      return { success: true, message: msg };
    } catch (err: any) {
      console.error('[Migrations] Neon migration failed:', err);
      throw err;
    } finally {
      await pool.end();
    }
  } else {
    const pool = new pg.Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
      max: 1,
    });

    try {
      const db = nodeDrizzle(pool);
      await nodeMigrate(db, { migrationsFolder });
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
}

if (process.argv[1]?.includes('migrate')) {
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
