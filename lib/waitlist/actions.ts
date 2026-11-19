'use server';

import { after } from 'next/server';
import { getDb } from '@/lib/db';
import { waitlist } from '@/lib/db/schema';
import { syncToLoops } from '@/lib/loops';
import { isSignupRateLimited } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';
import { verifyTurnstile } from '@/lib/turnstile';
import { canonicalEmail } from './canonical-email';
import { firstError, waitlistSignupSchema } from './validation';

export type JoinWaitlistInput = {
  fullName: string;
  email: string;
  turnstileToken?: string;
  /** Honeypot: hidden from people, filled in by naive bots. */
  website?: string;
};

export type JoinWaitlistResult =
  | { status: 'success' }
  | { status: 'duplicate' }
  | { status: 'error'; reason: 'invalid' | 'rate_limited' | 'bot_check' | 'server'; message: string };

const GENERIC_ERROR = 'Something went wrong. Please try again.';

export async function joinWaitlist(input: JoinWaitlistInput): Promise<JoinWaitlistResult> {
  try {
    // Pretend success to bots so they don't learn to adapt.
    if (input.website) return { status: 'success' };

    const ip = await getClientIp();

    if (await isSignupRateLimited(ip)) {
      return { status: 'error', reason: 'rate_limited', message: 'Too many requests. Please try again in a minute.' };
    }

    if (!(await verifyTurnstile(input.turnstileToken, ip))) {
      return { status: 'error', reason: 'bot_check', message: 'Please complete the verification and try again.' };
    }

    const parsed = waitlistSignupSchema.safeParse(input);
    if (!parsed.success) {
      return { status: 'error', reason: 'invalid', message: firstError(parsed.error) };
    }
    const { fullName, email } = parsed.data;

    // ON CONFLICT DO NOTHING against the email_canonical unique index: no
    // select-then-insert race, and a duplicate (including aliases such as
    // ada+x@gmail.com for ada@gmail.com) simply returns no row.
    const inserted = await getDb()
      .insert(waitlist)
      .values({ fullName, email, emailCanonical: canonicalEmail(email) })
      .onConflictDoNothing()
      .returning({ id: waitlist.id });

    if (inserted.length === 0) return { status: 'duplicate' };

    // Best-effort and off the response path: the signup is already saved,
    // so a Loops outage must never fail the request -- just log it.
    after(async () => {
      try {
        await syncToLoops({ email, fullName });
      } catch (err) {
        console.error('[waitlist] Loops sync failed (signup still recorded):', err);
      }
    });

    return { status: 'success' };
  } catch (err) {
    console.error('[waitlist] signup failed:', err);
    return { status: 'error', reason: 'server', message: GENERIC_ERROR };
  }
}
