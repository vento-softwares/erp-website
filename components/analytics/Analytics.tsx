'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';

/**
 * Initialises PostHog once on the client. Mounted on public pages only, so
 * admin activity isn't tracked. No-op if NEXT_PUBLIC_POSTHOG_KEY isn't set.
 */
export function Analytics() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return null;
}
