'use client';

import { useRef, type ReactNode } from 'react';
import { pointer, useReducedMotion, useWindowFrame } from '@/components/motion/hooks';

const TILT_STRENGTH = 0.6;

/** Tilts the hero dashboard with scroll position and mouse movement. */
export function HeroDashboardTilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useWindowFrame(
    ['scroll', 'resize', 'mousemove'],
    () => {
      const el = ref.current;
      if (!el) return;
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      const hp = Math.min(1, y / (vh * 0.6));
      let tx = 0;
      let ty = 0;
      if (pointer.x >= 0) {
        tx = (pointer.y / vh - 0.5) * -1;
        ty = pointer.x / (window.innerWidth || 1) - 0.5;
      }
      const rx = 12 * (1 - hp * 0.9) + tx * 3.2 * TILT_STRENGTH;
      const ry = ty * 4.5 * TILT_STRENGTH * (1 - hp * 0.6);
      el.style.transform = `perspective(1600px) translateY(${-y * 0.055}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    },
    !reduced,
  );

  return (
    <div
      ref={ref}
      className="relative z-1 will-change-transform transform-3d"
      style={{ transform: 'perspective(1600px) rotateX(12deg)' }}
    >
      {children}
    </div>
  );
}

/** "SCROLL" hint at the bottom of the hero; fades out as you scroll. */
export function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);
  useWindowFrame(['scroll'], () => {
    if (ref.current) ref.current.style.opacity = String(Math.max(0, 1 - window.scrollY / 140));
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute bottom-[26px] left-1/2 z-3 flex -translate-x-1/2 flex-col items-center gap-2.5 transition-opacity duration-300"
    >
      <span className="pl-[.32em] font-mono text-[9.5px] tracking-[.32em] text-faint">SCROLL</span>
      <span className="flex h-8 w-5 justify-center rounded-[11px] border border-fg/16 pt-1.5">
        <span className="animate-scroll-dot h-[7px] w-[3px] rounded-[2px] bg-brand-soft" />
      </span>
    </div>
  );
}
