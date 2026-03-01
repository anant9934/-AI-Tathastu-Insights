import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export interface DatabaseConnection {
  isLive: boolean;
  type: 'neon_postgres' | 'local_postgres' | 'mock_store';
  db: any;
  pool?: pg.Pool;
}

let connection: DatabaseConnection;

export function getDatabase(): DatabaseConnection {
  if (connection) return connection;

  const connectionString = process.env.DATABASE_URL;

  if (connectionString && !connectionString.includes('dummy')) {
    try {
      const pool = new Pool({
        connectionString,
        ssl: connectionString.includes('sslmode=require') || connectionString.includes('neon.tech')
          ? { rejectUnauthorized: false }
          : false,
        max: 10,
        idleTimeoutMillis: 30000,
      });

      const db = drizzle(pool, { schema });
      connection = {
        isLive: true,
        type: connectionString.includes('neon.tech') ? 'neon_postgres' : 'local_postgres',
        db,
        pool,
      };
      return connection;
    } catch (err) {
      console.warn('PostgreSQL pool initialization failed, using persistent in-memory repository:', err);
    }
  }

  // Fallback persistent repository for test runs and demonstration when no external DB is provisioned
  connection = {
    isLive: false,
    type: 'mock_store',
    db: null,
  };
  return connection;
}

export { schema };
