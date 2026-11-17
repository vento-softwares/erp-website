'use client';

import { adminGhostButton } from '@/components/admin/styles';

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto mt-[12vh] max-w-[420px] text-center">
      <h1 className="m-0 text-2xl font-bold">Couldn&rsquo;t load the waitlist</h1>
      <p className="mt-2 mb-6 text-sm text-muted">
        The database didn&rsquo;t respond. Check the server logs and that DATABASE_URL is correct, then try again.
      </p>
      <button type="button" onClick={reset} className={adminGhostButton}>
        Try again
      </button>
    </div>
  );
}
