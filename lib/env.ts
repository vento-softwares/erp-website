// No `server-only` import here: instrumentation.ts loads this outside the
// React server graph. It's still effectively server-only -- in a browser
// bundle the secret vars are undefined, so getEnv() would throw at once.
import { z } from 'zod';

const optional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

const serverSchema = z
  .object({
    DATABASE_URL: z.url({ message: 'DATABASE_URL must be a Postgres connection string (Neon -> Connect).' }),
    ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters.'),
    SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters (try `openssl rand -base64 48`).'),

    ADMIN_PATH: optional.pipe(
      z
        .string()
        .regex(
          /^[A-Za-z0-9_-]{12,64}$/,
          'ADMIN_PATH must be 12-64 letters, digits, "-" or "_", with no slashes (e.g. ops-k3v9x2m7q4).',
        )
        .optional(),
    ),

    LOOPS_API_KEY: optional,

    UPSTASH_REDIS_REST_URL: optional,
    UPSTASH_REDIS_REST_TOKEN: optional,

    TURNSTILE_SECRET_KEY: optional,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: optional,
  })
  .refine((env) => Boolean(env.UPSTASH_REDIS_REST_URL) === Boolean(env.UPSTASH_REDIS_REST_TOKEN), {
    message: 'Set both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, or neither.',
  })
  .refine((env) => Boolean(env.TURNSTILE_SECRET_KEY) === Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY), {
    message: 'Set both TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY, or neither.',
  });

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | undefined;

/**
 * Validated server environment. Throws a readable error listing every
 * missing/invalid variable. Called at server start from instrumentation.ts
 * so misconfiguration fails loudly instead of at the first signup.
 */
export function getEnv(): ServerEnv {
  if (cached) return cached;
  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.') || '(env)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}\nSee .env.example.`);
  }
  cached = result.data;
  return cached;
}
