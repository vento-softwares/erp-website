'use client';

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ElementType } from 'react';

type RevealProps<T extends ElementType> = {
  as?: T;
  /** Delay in ms before the element animates in once it's on screen. */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, 'as'>;

type Phase = 'hidden' | 'revealing' | 'done';

/**
 * Fades and lifts its content in the first time it scrolls into view.
 * The visual states live in globals.css (.reveal / [data-revealed]).
 */
export function Reveal<T extends ElementType = 'div'>({ as, delay = 0, className, style, ...rest }: RevealProps<T>) {
  const Tag: ElementType = as ?? 'div';
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>('hidden');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase('revealing');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== 'revealing') return;
    // Drop the stagger delay afterwards so hover transitions aren't delayed.
    const t = window.setTimeout(() => setPhase('done'), delay + 950);
    return () => window.clearTimeout(t);
  }, [phase, delay]);

  return (
    <Tag
      ref={ref}
      className={className ? `reveal ${className}` : 'reveal'}
      data-revealed={phase === 'hidden' ? undefined : ''}
      style={{ transitionDelay: delay && phase !== 'done' ? `${delay}ms` : undefined, ...style }}
      {...rest}
    />
  );
}
