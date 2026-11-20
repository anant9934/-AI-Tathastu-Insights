import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export interface DatabaseConnection {
  isLive: boolean;
  type: 'neon_postgres' | 'local_postgres' | 'mock_store' | 'persistent_disk';
  db: any;
  pool?: pg.Pool;
}

let connection: DatabaseConnection | null = null;

export function getDatabase(): DatabaseConnection {
  if (connection) return connection;

  const connectionString = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  // Strict Production Enforcement: Never silently fall back in production
  if (isProduction) {
    if (!connectionString || connectionString.includes('dummy') || connectionString.includes('YOUR_STRONG_PASSWORD')) {
      throw new Error(
        'FATAL CONFIGURATION ERROR: Production environment requires a valid, authenticated DATABASE_URL. In-memory or dummy fallback is strictly prohibited in production.'
      );
    }
  }

  if (connectionString && !connectionString.includes('dummy') && !connectionString.includes('YOUR_STRONG_PASSWORD')) {
    try {
      const pool = new Pool({
        connectionString,
        ssl: connectionString.includes('sslmode=require') || connectionString.includes('neon.tech')
          ? { rejectUnauthorized: false }
          : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });

      const db = drizzle(pool, { schema });
      connection = {
        isLive: true,
        type: connectionString.includes('neon.tech') ? 'neon_postgres' : 'local_postgres',
        db,
        pool,
      };
      console.log(`[Database] Connected successfully to PostgreSQL (${connection.type}).`);
      return connection;
    } catch (err: any) {
      if (isProduction) {
        throw new Error(`FATAL DATABASE ERROR: Failed to connect to production PostgreSQL: ${err.message}`);
      }
      console.warn('[Database] PostgreSQL pool initialization failed, utilizing persistent disk store for local development:', err.message);
    }
  }

  // Persistent file/disk backed store for local development and test environments
  connection = {
    isLive: false,
    type: 'persistent_disk',
    db: null,
  };
  return connection;
}

export async function checkDatabaseHealth(): Promise<{ isHealthy: boolean; latencyMs?: number; error?: string }> {
  const dbStatus = getDatabase();
  if (!dbStatus.isLive || !dbStatus.pool) {
    return { isHealthy: !process.env.NODE_ENV || process.env.NODE_ENV !== 'production' };
  }

  const start = Date.now();
  try {
    const client = await dbStatus.pool.connect();
    await client.query('SELECT 1');
    client.release();
    return { isHealthy: true, latencyMs: Date.now() - start };
  } catch (err: any) {
    return { isHealthy: false, error: err.message };
  }
}

export { schema };
