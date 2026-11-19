import 'server-only';
import { headers } from 'next/headers';

/** Best-effort client IP. On Vercel, x-forwarded-for is set by the platform. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return h.get('x-real-ip') ?? 'unknown';
}
