'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { WAITLIST_STATUSES } from '@/lib/waitlist/constants';
import { adminField } from './styles';

/** Search box + status filter, kept in the URL so views are shareable. */
export function Filters({ search, status }: { search: string; status: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [term, setTerm] = useState(search);
  const [pending, startTransition] = useTransition();
  const debounce = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(debounce.current), []);

  function apply(next: { search?: string; status?: string }) {
    const qs = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) qs.set(key, value);
      else qs.delete(key);
    }
    qs.delete('page'); // any filter change goes back to page 1
    const query = qs.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname));
  }

  return (
    <>
      <input
        type="search"
        value={term}
        placeholder="Search by name or email…"
        aria-label="Search by name or email"
        className={`${adminField} flex-[1_1_220px]`}
        onChange={(e) => {
          const value = e.target.value;
          setTerm(value);
          window.clearTimeout(debounce.current);
          debounce.current = window.setTimeout(() => apply({ search: value.trim() }), 300);
        }}
      />
      <select
        defaultValue={status}
        aria-label="Filter by status"
        className={`${adminField} flex-none`}
        onChange={(e) => apply({ status: e.target.value })}
      >
        <option value="">All statuses</option>
        {WAITLIST_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s[0].toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      {pending && <span className="font-mono text-xs text-faint">Loading…</span>}
    </>
  );
}
