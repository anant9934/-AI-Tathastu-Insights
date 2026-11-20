import * as dotenv from 'dotenv';
dotenv.config();
import { neon } from '@neondatabase/serverless';

async function listTables() {
  const sql = neon(process.env.DATABASE_URL!);
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  console.log(`Found ${tables.length} tables in Neon PostgreSQL:`);
  console.log(tables.map((t: any) => t.table_name).join(', '));
}

listTables();
