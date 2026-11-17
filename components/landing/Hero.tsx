import Image from 'next/image';
import type { CSSProperties } from 'react';
import { ParticleCanvas } from '@/components/motion/ParticleCanvas';
import { BrowserFrame } from './BrowserFrame';
import { HERO } from './content';
import { HeroDashboardTilt, ScrollIndicator } from './HeroEffects';
import { CtaLink } from './Links';

/** Stagger index for the intro animation (read by .hero-word/.hero-item CSS). */
const stagger = (i: number) => ({ '--i': i }) as CSSProperties;

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8 H13 M9 3.5 L13.5 8 L9 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Backdrop() {
  return (
    <>
      {/* Vertical grid lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mask-[linear-gradient(180deg,transparent,black_10%,black_80%,transparent)]"
        style={{
          background:
            'repeating-linear-gradient(90deg,rgb(247 248 252/.026) 0,rgb(247 248 252/.026) 1px,transparent 1px,transparent 110px)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(1200px 520px at 50% 108%,rgb(0 45 74/.55),transparent 70%)' }}
      />
      {/* Drifting colour glows */}
      <div
        aria-hidden
        className="ambient animate-drift-1 pointer-events-none absolute -top-[14%] -left-[12%] size-[58vw] will-change-transform"
        style={{ background: 'radial-gradient(circle,rgb(108 99 245/.15),transparent 62%)' }}
      />
      <div
        aria-hidden
        className="ambient animate-drift-2 pointer-events-none absolute top-[16%] -right-[14%] size-[52vw] will-change-transform"
        style={{ background: 'radial-gradient(circle,rgb(76 201 240/.09),transparent 62%)' }}
      />
      <ParticleCanvas className="ambient" />
      {/* Scanning light beams */}
      <div
        aria-hidden
        className="ambient animate-scan pointer-events-none absolute -top-[14%] left-[22%] h-[130px] w-px bg-linear-to-b from-transparent via-[rgb(139_130_255/.55)] to-transparent"
      />
      <div
        aria-hidden
        className="ambient animate-scan-fast pointer-events-none absolute -top-[14%] left-[71%] h-[110px] w-px bg-linear-to-b from-transparent via-[rgb(76_201_240/.5)] to-transparent"
      />
    </>
  );
}

export function Hero() {
  let wordIndex = 0;

  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center px-gutter pt-[clamp(130px,19vh,200px)]">
      <Backdrop />

      <div className="relative z-2 flex max-w-[940px] flex-col items-center text-center">
        <div
          className="hero-item inline-flex items-center gap-[9px] rounded-full border border-fg/10 bg-fg/3 px-[17px] py-2 font-mono text-[11px] tracking-[.2em] text-muted uppercase"
          style={stagger(0)}
        >
          <span className="animate-pulse-dot size-1.5 rounded-full bg-accent shadow-[0_0_10px_rgb(76_201_240/.9)]" />
          {HERO.badge}
        </div>

        <h1 className="mt-[34px] mb-0 text-[clamp(42px,6.3vw,86px)] leading-[1.05] font-medium tracking-[-0.034em] text-balance">
          {HERO.headline.map((line, li) => (
            <span key={li} className="block">
              {line.map((word, wi) => {
                const i = wordIndex++;
                const last = wi === line.length - 1;
                return (
                  <span key={wi} className="-mb-[.1em] inline-block overflow-hidden pb-[.1em] align-top">
                    <span className={`hero-word ${'highlight' in word && word.highlight ? 'text-brand-soft' : ''}`} style={stagger(i)}>
                      {word.text}
                      {!last && ' '}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <p
          className="hero-item mt-[26px] mb-0 max-w-[580px] text-[clamp(15.5px,1.35vw,17.5px)] leading-[1.68] font-normal text-muted"
          style={stagger(1)}
        >
          {HERO.lead}
        </p>

        <div className="hero-item mt-[38px] flex flex-wrap justify-center gap-3.5" style={stagger(2)}>
          <CtaLink className="btn-primary">
            {HERO.primaryCta}
            <ArrowIcon />
          </CtaLink>
          <a className="btn-secondary" data-magnetic="" href="#product">
            {HERO.secondaryCta}
          </a>
        </div>
      </div>

      <div className="hero-item hero-item-lg relative z-2 mt-[clamp(64px,9vh,110px)] w-[min(1120px,100%)]" style={stagger(3)}>
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-[6%] -inset-y-[8%]"
          style={{
            background:
              'radial-gradient(52% 55% at 42% 42%,rgb(108 99 245/.22),transparent 70%),radial-gradient(40% 45% at 72% 60%,rgb(76 201 240/.13),transparent 70%)',
          }}
        />
        <HeroDashboardTilt>
          <div className="animate-float">
            <BrowserFrame>
              <Image
                src="/dashboard-preview.png"
                alt="The Vento dashboard: navy sidebar with business modules, KPI cards, revenue chart and sales report"
                width={2362}
                height={1432}
                sizes="(max-width: 1160px) 100vw, 1120px"
                preload
                className="block h-auto w-full"
              />
            </BrowserFrame>
          </div>
        </HeroDashboardTilt>
      </div>

      <ScrollIndicator />
    </section>
  );
}
