'use client';

import { useEffect } from 'react';
import { useReducedMotion } from './hooks';

/**
 * Elements with a `data-magnetic` attribute drift slightly toward the cursor
 * while hovered. Mount once per page.
 */
export function MagneticEffect() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let active: HTMLElement | null = null;

    const release = () => {
      if (!active) return;
      delete active.dataset.magnetActive;
      active.style.transform = '';
      active = null;
    };

    const onMove = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-magnetic]') : null;
      if (target !== active) {
        release();
        active = target;
        if (active) active.dataset.magnetActive = '';
      }
      if (!active) return;
      const r = active.getBoundingClientRect();
      const dx = Math.max(-8, Math.min(8, (e.clientX - r.left - r.width / 2) * 0.18));
      const dy = Math.max(-6, Math.min(6, (e.clientY - r.top - r.height / 2) * 0.22));
      active.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      release();
    };
  }, [reduced]);

  return null;
}
