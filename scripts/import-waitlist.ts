/**
 * One-off import of existing waitlist rows (e.g. from Supabase) into Neon.
 *
 *   yarn db:import path/to/export.csv            # dry run: report only
 *   yarn db:import path/to/export.csv --commit   # actually insert
 *
 * Accepts the CSV produced by the old admin "Export CSV" button or a Supabase
 * table export. Required columns: full_name, email. Optional: id, created_at,
 * status, invite_sent. Emails are lowercased; duplicates (same canonical inbox,
 * e.g. ada+x@gmail.com = a.da@gmail.com) keep the earliest signup. Rows already
 * in Neon (same canonical email) are skipped.
 */
import { readFileSync } from 'node:fs';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { parseCsv } from '../lib/csv';
import { waitlist } from '../lib/db/schema';
import { canonicalEmail } from '../lib/waitlist/canonical-email';
import { WAITLIST_STATUSES, type WaitlistStatus } from '../lib/waitlist/constants';

config({ path: ['.env.local', '.env'], quiet: true });

const [file, ...flags] = process.argv.slice(2);
const commit = flags.includes('--commit');

if (!file) {
  console.error('Usage: yarn db:import <file.csv> [--commit]');
  process.exit(1);
}
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The old export prefixed formula-like values with ' to defuse them; undo that.
const unescape = (v: string) => (/^'[=+\-@\t\r]/.test(v) ? v.slice(1) : v);

const [header, ...records] = parseCsv(readFileSync(file, 'utf8'));
if (!header) {
  console.error('The CSV file is empty.');
  process.exit(1);
}
const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name);
const idx = {
  id: col('id'),
  fullName: col('full_name'),
  email: col('email'),
  createdAt: col('created_at'),
  status: col('status'),
  inviteSent: col('invite_sent'),
};
if (idx.fullName < 0 || idx.email < 0) {
  console.error(`CSV must have full_name and email columns. Found: ${header.join(', ')}`);
  process.exit(1);
}

type Row = typeof waitlist.$inferInsert;
const byEmail = new Map<string, Row>();
const problems: string[] = [];
let duplicates = 0;

records.forEach((r, i) => {
  const line = i + 2;
  const get = (k: number) => (k >= 0 ? unescape((r[k] ?? '').trim()) : '');
  const email = get(idx.email).toLowerCase();
  const fullName = get(idx.fullName).replace(/[<>]/g, '').slice(0, 120);
  if (!EMAIL_RE.test(email) || fullName.length < 1) {
    problems.push(`line ${line}: invalid name/email (${JSON.stringify(r)})`);
    return;
  }

  const createdRaw = get(idx.createdAt);
  const createdAt = createdRaw ? new Date(createdRaw) : undefined;
  if (createdAt && Number.isNaN(createdAt.getTime())) {
    problems.push(`line ${line}: unreadable created_at "${createdRaw}"`);
    return;
  }

  const statusRaw = get(idx.status).toLowerCase();
  const status = (WAITLIST_STATUSES as readonly string[]).includes(statusRaw) ? (statusRaw as WaitlistStatus) : 'waiting';
  const id = get(idx.id);
  const row: Row = {
    id: UUID_RE.test(id) ? id : undefined,
    fullName,
    email,
    emailCanonical: canonicalEmail(email),
    createdAt,
    status,
    inviteSent: ['true', 't', '1', 'yes'].includes(get(idx.inviteSent).toLowerCase()),
  };

  const key = row.emailCanonical;
  const existing = byEmail.get(key);
  if (existing) {
    duplicates++;
    const keepNew = row.createdAt && (!existing.createdAt || row.createdAt < existing.createdAt);
    if (keepNew) byEmail.set(key, row);
    return;
  }
  byEmail.set(key, row);
});

const rows = [...byEmail.values()];
console.log(`Read ${records.length} rows -> ${rows.length} unique emails (${duplicates} duplicates merged).`);
if (problems.length) {
  console.log(`Skipped ${problems.length} invalid rows:`);
  problems.forEach((p) => console.log(`  - ${p}`));
}

if (!commit) {
  console.log('\nDry run only. Re-run with --commit to insert.');
  process.exit(0);
}

async function insertAll(databaseUrl: string) {
  const db = drizzle({ client: neon(databaseUrl) });
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 200) {
    const batch = rows.slice(i, i + 200);
    const res = await db.insert(waitlist).values(batch).onConflictDoNothing().returning({ id: waitlist.id });
    inserted += res.length;
  }
  console.log(`Inserted ${inserted} rows; ${rows.length - inserted} already existed in Neon.`);
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set (.env.local).');
  process.exit(1);
}

insertAll(process.env.DATABASE_URL).catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
