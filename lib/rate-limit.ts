import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getEnv } from '@/lib/env';

type Limiter = (key: string) => Promise<boolean>;

const WINDOW_MS = 60_000;

/**
 * Upstash-backed limiter when configured (a real global cap across every
 * serverless instance). Without Upstash it falls back to an in-memory window,
 * which only limits a single instance -- fine for local dev, weak in prod.
 */
function createLimiter(prefix: string, limit: number): Limiter {
  const env = getEnv();

  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const ratelimit = new Ratelimit({
      redis: new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN }),
      limiter: Ratelimit.slidingWindow(limit, '60 s'),
      prefix: `vento:${prefix}`,
    });
    return async (key) => !(await ratelimit.limit(key)).success;
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(`[rate-limit] Upstash not configured; "${prefix}" uses per-instance in-memory limiting.`);
  }
  const hits = new Map<string, { start: number; count: number }>();
  return async (key) => {
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.start > WINDOW_MS) {
      hits.set(key, { start: now, count: 1 });
      return false;
    }
    entry.count += 1;
    return entry.count > limit;
  };
}

const limiters = new Map<string, Limiter>();

function limiter(prefix: string, limit: number): Limiter {
  let l = limiters.get(prefix);
  if (!l) {
    l = createLimiter(prefix, limit);
    limiters.set(prefix, l);
  }
  return l;
}

/** 5 signups per minute per IP, matching the original site. */
export const isSignupRateLimited = (ip: string) => limiter('signup', 5)(ip);

/** Slows password guessing on /admin/login. */
export const isLoginRateLimited = (ip: string) => limiter('admin-login', 10)(ip);
