import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { WAITLIST_STATUSES } from '../waitlist/constants';

export { WAITLIST_STATUSES, type WaitlistStatus } from '../waitlist/constants';

export const waitlist = pgTable(
  'waitlist',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: text('full_name').notNull(),
    email: text('email').notNull(),
    // canonicalEmail(email): one row per real inbox, so ada+x@gmail.com and
    // a.da@gmail.com can't sign up again as ada@gmail.com.
    emailCanonical: text('email_canonical').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    status: text('status', { enum: WAITLIST_STATUSES }).notNull().default('waiting'),
    inviteSent: boolean('invite_sent').notNull().default(false),
  },
  (t) => [
    // Also covers case-insensitive uniqueness, since the canonical form is lowercase.
    uniqueIndex('waitlist_email_canonical_key').on(t.emailCanonical),
    index('waitlist_status_idx').on(t.status),
    index('waitlist_created_at_idx').on(t.createdAt.desc()),
    check('waitlist_status_check', sql`${t.status} in ('waiting', 'invited', 'joined')`),
  ],
);

export type WaitlistEntry = typeof waitlist.$inferSelect;
