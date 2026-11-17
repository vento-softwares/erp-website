'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(cb: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * Runs `onFrame` at most once per animation frame whenever one of the given
 * window events fires (and once on mount). Cheaper than a permanent rAF loop:
 * nothing runs while the user isn't scrolling or moving the mouse.
 */
export function useWindowFrame(events: readonly (keyof WindowEventMap)[], onFrame: () => void, enabled = true) {
  const cb = useRef(onFrame);
  useEffect(() => {
    cb.current = onFrame;
  });

  const key = events.join(',');
  useEffect(() => {
    if (!enabled) return;
    const names = key.split(',') as (keyof WindowEventMap)[];
    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        cb.current();
      });
    };
    schedule();
    for (const name of names) window.addEventListener(name, schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      for (const name of names) window.removeEventListener(name, schedule);
    };
  }, [key, enabled]);
}

/** Last known pointer position, shared by effects that react to the mouse. */
export const pointer = { x: -1, y: -1 };

if (typeof window !== 'undefined') {
  window.addEventListener(
    'mousemove',
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    },
    { passive: true },
  );
}
