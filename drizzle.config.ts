import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Next.js reads .env.local automatically; drizzle-kit doesn't, so load it here.
config({ path: ['.env.local', '.env'], quiet: true });

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Only needed for migrate/studio; `db:generate` works without a database.
    url: process.env.DATABASE_URL ?? '',
  },
  strict: true,
  verbose: true,
});
