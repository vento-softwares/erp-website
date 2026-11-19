'use client';

import { useEffect, useState } from 'react';

type Phase = 'shown' | 'leaving' | 'gone';

/**
 * Full-screen intro: draws the logo, then fades out and starts the hero
 * animation by setting html[data-intro] (see .hero-word/.hero-item in CSS).
 */
export function Loader() {
  const [phase, setPhase] = useState<Phase>('shown');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = reduced ? 300 : 1900;
    const leave = window.setTimeout(() => {
      setPhase('leaving');
      document.documentElement.dataset.intro = '';
    }, delay);
    const remove = window.setTimeout(() => setPhase('gone'), delay + 700);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(remove);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      id="loader"
      aria-hidden
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 bg-ink transition-[opacity,transform] duration-[650ms] ease-out ${
        phase === 'leaving' ? '-translate-y-3.5 opacity-0' : ''
      }`}
    >
      <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
        <path
          d="M5 7 L16 27 L27 7"
          stroke="#6C63F5"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw [stroke-dasharray:46] [stroke-dashoffset:46] motion-reduce:[stroke-dashoffset:0]"
        />
        <circle cx="16" cy="10" r="2.4" fill="#4CC9F0" className="animate-fade-late opacity-0 motion-reduce:opacity-100" />
      </svg>
      <div className="animate-fade-mid pl-[0.44em] text-sm font-bold tracking-[0.44em] uppercase opacity-0 motion-reduce:opacity-100">
        Vento
      </div>
      <div className="absolute bottom-[11vh] h-px w-[120px] overflow-hidden bg-fg/8">
        <div className="animate-loader h-full w-2/5 bg-linear-to-r from-brand to-accent" />
      </div>
    </div>
  );
}
