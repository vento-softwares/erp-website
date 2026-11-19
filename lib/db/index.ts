import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { getEnv } from '@/lib/env';
import * as schema from './schema';

function createDb() {
  // HTTP driver: one stateless request per query, which suits serverless
  // functions (no connection pool to exhaust or keep warm).
  return drizzle({ client: neon(getEnv().DATABASE_URL), schema });
}

let instance: ReturnType<typeof createDb> | undefined;

export function getDb() {
  instance ??= createDb();
  return instance;
}
