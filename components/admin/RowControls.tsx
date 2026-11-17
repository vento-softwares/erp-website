'use client';

import { useOptimistic, useTransition } from 'react';
import { updateEntry } from '@/app/admin/actions';
import { WAITLIST_STATUSES, type WaitlistStatus } from '@/lib/waitlist/constants';

const statusTone: Record<WaitlistStatus, string> = {
  waiting: 'text-muted',
  invited: 'text-accent',
  joined: 'text-brand-soft',
};

/** Saves immediately; the optimistic value reverts if the save fails. */
export function StatusSelect({ id, status }: { id: string; status: WaitlistStatus }) {
  const [optimistic, setOptimistic] = useOptimistic(status);
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={optimistic}
      disabled={pending}
      aria-label="Status"
      className={`rounded-[7px] border border-fg/14 bg-fg/4 px-2 py-1.5 text-[13px] disabled:opacity-60 ${statusTone[optimistic]}`}
      onChange={(e) => {
        const next = e.target.value as WaitlistStatus;
        startTransition(async () => {
          setOptimistic(next);
          const res = await updateEntry({ id, status: next });
          if (!res.ok) alert(res.error);
        });
      }}
    >
      {WAITLIST_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-panel text-fg">
          {s[0].toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}

export function InviteToggle({ id, inviteSent }: { id: string; inviteSent: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(inviteSent);
  const [pending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      checked={optimistic}
      disabled={pending}
      aria-label="Invite sent"
      className="size-4 cursor-pointer accent-brand"
      onChange={(e) => {
        const next = e.target.checked;
        startTransition(async () => {
          setOptimistic(next);
          const res = await updateEntry({ id, inviteSent: next });
          if (!res.ok) alert(res.error);
        });
      }}
    />
  );
}
