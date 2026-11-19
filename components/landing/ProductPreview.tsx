'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useReducedMotion, useWindowFrame } from '@/components/motion/hooks';
import { BrowserFrame } from './BrowserFrame';
import { PRODUCT_PREVIEW } from './content';

type Tone = 'brand' | 'accent';

// Highlight boxes and callout pills over the screenshot, as percentages of
// the image. They appear one after another (same index) as you scroll.
const HIGHLIGHTS: { left: string; top: string; width: string; height: string; tone: Tone; radius: number }[] = [
  { left: '0.8%', top: '1.6%', width: '15.4%', height: '96.4%', tone: 'accent', radius: 8 },
  { left: '19%', top: '50.6%', width: '56.2%', height: '46.6%', tone: 'brand', radius: 10 },
  { left: '76.6%', top: '50.6%', width: '22%', height: '46.6%', tone: 'accent', radius: 10 },
];

const CALLOUTS: { label: string; pos: { left?: string; right?: string; top: string }; tone: Tone }[] = [
  { label: 'CONNECTED OPERATIONS', pos: { left: '17.6%', top: '6%' }, tone: 'accent' },
  { label: 'LIVE VISIBILITY', pos: { left: '20.6%', top: '42.5%' }, tone: 'brand' },
  { label: 'ACTIONABLE INSIGHT', pos: { right: '1.6%', top: '42.5%' }, tone: 'accent' },
];

/** Scroll progress at which highlight/callout N starts to appear. */
const STARTS = [0.44, 0.62, 0.79];

const highlightStyle: Record<Tone, string> = {
  accent:
    'border-[rgb(76_201_240/.55)] bg-[rgb(76_201_240/.05)] shadow-[0_0_28px_rgb(76_201_240/.18),inset_0_0_28px_rgb(76_201_240/.07)]',
  brand:
    'border-[rgb(139_130_255/.55)] bg-[rgb(108_99_245/.05)] shadow-[0_0_28px_rgb(108_99_245/.2),inset_0_0_28px_rgb(108_99_245/.07)]',
};
const calloutBorder: Record<Tone, string> = {
  accent: 'border-[rgb(76_201_240/.35)]',
  brand: 'border-[rgb(139_130_255/.4)]',
};
const dot: Record<Tone, string> = {
  accent: 'bg-accent shadow-[0_0_10px_var(--color-accent)]',
  brand: 'bg-brand-soft shadow-[0_0_10px_var(--color-brand-soft)]',
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function ProductPreview() {
  const frameRef = useRef<HTMLDivElement>(null);
  const netRef = useRef<HTMLDivElement>(null);
  const highlightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const calloutRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  // The frame flattens out as it scrolls into view, then the highlights and
  // callouts light up in sequence.
  useWindowFrame(['scroll', 'resize'], () => {
    const frame = frameRef.current;
    if (!frame) return;
    const vh = window.innerHeight || 1;
    const p = clamp01((vh * 0.92 - frame.getBoundingClientRect().top) / (vh * 0.6));

    if (reduced) {
      frame.style.transform = 'none';
      if (netRef.current) netRef.current.style.opacity = '0.5';
    } else {
      const e = 1 - Math.pow(1 - Math.min(1, p / 0.55), 3);
      frame.style.transform = `perspective(1500px) rotateX(${20 * (1 - e)}deg) rotateY(${-7 * (1 - e)}deg) scale(${0.88 + 0.12 * e})`;
      if (netRef.current) netRef.current.style.opacity = String(clamp01((p - 0.12) / 0.25) * 0.55);
    }

    STARTS.forEach((start, i) => {
      const o = reduced ? 1 : clamp01((p - start) / 0.07);
      const h = highlightRefs.current[i];
      const c = calloutRefs.current[i];
      if (h) h.style.opacity = String(o);
      if (c) {
        c.style.opacity = String(o);
        c.style.transform = `translateY(${(1 - o) * 10}px)`;
      }
    });
  });

  return (
    <section id="product" className="relative px-[clamp(16px,4vw,48px)] py-[clamp(110px,14vh,160px)]">
      <div className="relative flex flex-col items-center justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(1000px 500px at 50% 60%,rgb(0 45 74/.3),transparent 72%)' }}
        />
        <div className="relative z-2 mb-[34px] text-center">
          <div className="font-mono text-[11px] tracking-[.26em] text-accent">{PRODUCT_PREVIEW.eyebrow}</div>
          <h2 className="mt-4 mb-0 text-[clamp(26px,3.2vw,40px)] font-medium tracking-[-0.025em] text-balance">
            {PRODUCT_PREVIEW.title}
          </h2>
        </div>

        <div className="relative w-[min(1060px,100%)]">
          {/* Connector lines that fade in around the frame */}
          <div ref={netRef} aria-hidden className="pointer-events-none absolute -inset-x-[8%] -inset-y-[4%] opacity-0">
            <div className="absolute top-[36%] left-0 h-px w-[14%] bg-linear-to-r from-[rgb(108_99_245/0)] to-[rgb(108_99_245/.55)]" />
            <div className="absolute top-[36%] left-[14%] size-[5px] -translate-x-0.5 -translate-y-0.5 rounded-full bg-brand-soft shadow-[0_0_12px_var(--color-brand-soft)]" />
            <div className="absolute top-[58%] right-0 h-px w-[12%] bg-linear-to-l from-[rgb(76_201_240/0)] to-[rgb(76_201_240/.55)]" />
            <div className="absolute top-[58%] right-[12%] size-[5px] translate-x-0.5 -translate-y-0.5 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
            <div className="absolute bottom-0 left-[16%] h-[11%] w-px bg-linear-to-t from-[rgb(108_99_245/0)] to-[rgb(108_99_245/.5)]" />
            <div className="absolute top-0 right-[22%] h-[9%] w-px bg-linear-to-b from-[rgb(76_201_240/0)] to-[rgb(76_201_240/.5)]" />
          </div>

          <div
            ref={frameRef}
            className="relative z-1 will-change-transform"
            style={{ transform: 'perspective(1500px) rotateX(20deg) rotateY(-7deg) scale(.88)' }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-[7%]"
              style={{
                background:
                  'radial-gradient(50% 55% at 45% 40%,rgb(108 99 245/.2),transparent 70%),radial-gradient(38% 44% at 74% 62%,rgb(76 201 240/.12),transparent 70%)',
              }}
            />
            <div className="relative">
              <BrowserFrame>
                <div className="relative">
                  <Image
                    src="/dashboard-preview.png"
                    alt=""
                    aria-hidden
                    width={2362}
                    height={1432}
                    sizes="(max-width: 1100px) 100vw, 1060px"
                    className="block h-auto w-full"
                  />
                  {HIGHLIGHTS.map((h, i) => (
                    <div
                      key={i}
                      ref={(el) => {
                        highlightRefs.current[i] = el;
                      }}
                      className={`absolute border opacity-0 transition-opacity duration-500 ${highlightStyle[h.tone]}`}
                      style={{ left: h.left, top: h.top, width: h.width, height: h.height, borderRadius: h.radius }}
                    />
                  ))}
                  {CALLOUTS.map((c, i) => (
                    <div
                      key={c.label}
                      ref={(el) => {
                        calloutRefs.current[i] = el;
                      }}
                      className={`absolute flex translate-y-2.5 items-center gap-2 rounded-full border bg-ink/88 px-4 py-2 font-mono text-[clamp(8.5px,.55vw+4px,11px)] tracking-[.13em] whitespace-nowrap text-fg opacity-0 backdrop-blur-[6px] transition-[opacity,transform] duration-500 ${calloutBorder[c.tone]}`}
                      style={c.pos}
                    >
                      <span className={`size-1.5 rounded-full ${dot[c.tone]}`} />
                      {c.label}
                    </div>
                  ))}
                </div>
              </BrowserFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
