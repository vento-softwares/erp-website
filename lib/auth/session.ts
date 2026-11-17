import 'server-only';
import { timingSafeEqual } from 'node:crypto';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { getEnv } from '@/lib/env';
import { SESSION_COOKIE, SESSION_TTL_SECONDS } from './constants';
import { sessionKey, verifySessionToken } from './token';

/** Constant-time comparison so response timing can't leak the password. */
export function isCorrectPassword(provided: string): boolean {
  const expected = Buffer.from(getEnv().ADMIN_PASSWORD);
  const given = Buffer.from(provided);
  if (given.length !== expected.length) return false;
  return timingSafeEqual(given, expected);
}

export async function createSession() {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(sessionKey(getEnv().SESSION_SECRET));

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * The real authorization check. proxy.ts redirects early for convenience, but
 * every admin page, action and route handler must call this itself.
 */
export async function isAdmin(): Promise<boolean> {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}
