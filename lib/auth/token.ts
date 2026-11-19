import { jwtVerify } from 'jose';

// Kept free of `server-only`/`next/headers` so proxy.ts can import it too.
export function sessionKey(secret: string | undefined): Uint8Array {
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET is missing or shorter than 32 characters.');
  return new TextEncoder().encode(secret);
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, sessionKey(process.env.SESSION_SECRET), { algorithms: ['HS256'] });
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
