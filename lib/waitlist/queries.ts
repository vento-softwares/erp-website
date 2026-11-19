import 'server-only';
import { and, count, desc, eq, ilike, or, type SQL } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { waitlist, type WaitlistStatus } from '@/lib/db/schema';
import { escapeLike, type AdminFilters } from './validation';

export const ADMIN_PAGE_SIZE = 50;

function whereFor({ search, status }: Pick<AdminFilters, 'search' | 'status'>): SQL | undefined {
  const conditions: SQL[] = [];
  if (status) conditions.push(eq(waitlist.status, status));
  if (search) {
    const pattern = `%${escapeLike(search)}%`;
    conditions.push(or(ilike(waitlist.fullName, pattern), ilike(waitlist.email, pattern))!);
  }
  return conditions.length ? and(...conditions) : undefined;
}

export async function listWaitlist(filters: AdminFilters) {
  const db = getDb();
  const where = whereFor(filters);

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(waitlist)
      .where(where)
      .orderBy(desc(waitlist.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset((filters.page - 1) * ADMIN_PAGE_SIZE),
    db.select({ total: count() }).from(waitlist).where(where),
  ]);

  return { rows, total };
}

export async function listWaitlistForExport(filters: Pick<AdminFilters, 'search' | 'status'>) {
  return getDb().select().from(waitlist).where(whereFor(filters)).orderBy(desc(waitlist.createdAt));
}

export async function updateWaitlistEntry(id: string, updates: { status?: WaitlistStatus; inviteSent?: boolean }) {
  const [row] = await getDb().update(waitlist).set(updates).where(eq(waitlist.id, id)).returning();
  return row ?? null;
}
