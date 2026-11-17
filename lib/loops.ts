import 'server-only';
import { getEnv } from '@/lib/env';

const LOOPS_API_BASE = 'https://app.loops.so/api/v1';

async function loopsRequest(method: 'POST' | 'PUT', path: string, apiKey: string, payload: unknown) {
  const res = await fetch(`${LOOPS_API_BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Loops ${path} failed (${res.status}): ${body}`);
  }
}

/**
 * Adds the signup to Loops as a contact and fires a "waitlist-joined" event.
 * Configure a Loop in the Loops dashboard triggered by that event to send the
 * welcome email (templates are built in Loops' visual editor, not via API).
 */
export async function syncToLoops({ email, fullName }: { email: string; fullName: string }) {
  const apiKey = getEnv().LOOPS_API_KEY;
  if (!apiKey) throw new Error('LOOPS_API_KEY is not configured.');

  // contacts/update upserts: it creates the contact, or updates it if the
  // email already exists in Loops (e.g. removed from our DB but not Loops).
  // contacts/create would 409 there and the event below would never fire.
  await loopsRequest('PUT', '/contacts/update', apiKey, {
    email,
    fullName,
    source: 'waitlist',
    userGroup: 'Waitlist',
  });
  await loopsRequest('POST', '/events/send', apiKey, { email, eventName: 'waitlist-joined' });
}
