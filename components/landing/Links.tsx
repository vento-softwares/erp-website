'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { track } from '@/lib/analytics';

/** "Join the Waitlist" call-to-action: tracked and magnetic. */
export function CtaLink({ onClick, children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      href="#waitlist"
      data-magnetic=""
      onClick={(e) => {
        track('Join Waitlist Button Clicked', { label: e.currentTarget.textContent?.trim() });
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Link for a page that doesn't exist yet (LinkedIn, Privacy, Terms). */
export function PlaceholderLink({ children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  return (
    <a href="#" aria-disabled="true" onClick={(e) => e.preventDefault()} {...rest}>
      {children}
    </a>
  );
}
