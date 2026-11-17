import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';

type SectionProps = {
  id: string;
  /** Alternating sections use the subtle navy vertical gradient. */
  alt?: boolean;
  /** Decorative radial glow behind the content (a CSS background value). */
  glow?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

export function Section({ id, alt, glow, className = '', innerClassName = '', children }: SectionProps) {
  return (
    <section id={id} className={`relative py-section px-gutter ${alt ? 'bg-section-alt' : ''} ${className}`}>
      {glow && <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />}
      <div className={`relative mx-auto max-w-[1120px] ${innerClassName}`}>{children}</div>
    </section>
  );
}

type Tone = 'brand' | 'accent';
const toneClass: Record<Tone, string> = { brand: 'text-brand-soft', accent: 'text-accent' };

/** Small monospace label above a section title, e.g. "THE FEATURES". */
export function Eyebrow({ children, tone = 'brand', reveal = true }: { children: ReactNode; tone?: Tone; reveal?: boolean }) {
  const className = `font-mono text-[11px] tracking-[0.26em] ${toneClass[tone]}`;
  return reveal ? <Reveal className={className}>{children}</Reveal> : <div className={className}>{children}</div>;
}

type SectionIntroProps = {
  eyebrow: ReactNode;
  tone?: Tone;
  title: ReactNode;
  lead?: ReactNode;
  centered?: boolean;
  titleMaxWidth?: string;
  leadMaxWidth?: string;
};

/** Eyebrow + heading + lead paragraph, staggered in on scroll. */
export function SectionIntro({
  eyebrow,
  tone,
  title,
  lead,
  centered,
  titleMaxWidth = 'max-w-[680px]',
  leadMaxWidth = 'max-w-[540px]',
}: SectionIntroProps) {
  const mx = centered ? 'mx-auto' : '';
  return (
    <>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <Reveal as="h2" delay={80} className={`mt-[22px] mb-0 text-display ${titleMaxWidth} ${mx}`}>
        {title}
      </Reveal>
      {lead && (
        <Reveal as="p" delay={160} className={`mt-6 mb-0 text-[16.5px] leading-[1.7] text-muted ${leadMaxWidth} ${mx}`}>
          {lead}
        </Reveal>
      )}
    </>
  );
}
