import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://neondb_owner:dummy@ep-tathastu-insights.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  },
  verbose: true,
  strict: true,
});
