// Runs once when a server instance starts. Validating env here makes a
// misconfigured deployment fail immediately with a clear list of problems.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getEnv } = await import('@/lib/env');
    getEnv();
  }
}
