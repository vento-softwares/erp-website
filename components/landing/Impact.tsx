import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionIntro } from '@/components/ui/Section';
import { IMPACT } from './content';

export function Impact() {
  return (
    <Section
      id="why"
      alt
      glow="radial-gradient(900px 460px at 50% 26%,rgb(108 99 245/.08),transparent 70%)"
      innerClassName="text-center"
    >
      <SectionIntro eyebrow={IMPACT.eyebrow} tone="accent" title={IMPACT.title} lead={IMPACT.lead} centered leadMaxWidth="max-w-[520px]" />

      <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[18px]">
        {IMPACT.stats.map((s, i) => {
          const accent = s.tone === 'accent';
          return (
            <Reveal key={s.label} delay={i * 110} className={`card rounded-2xl px-8 py-[46px] ${accent ? 'card-cyan' : ''}`}>
              <div className="text-[clamp(44px,4.6vw,58px)] leading-none font-bold tracking-[-0.02em]">
                {s.value}
                <span className={accent ? 'text-accent' : 'text-brand-soft'}>%</span>
              </div>
              <div className="mt-3.5 text-lg font-bold tracking-[-0.01em]">{s.label}</div>
              <div className={`mx-auto mt-6 h-0.5 w-[34px] rounded-[2px] ${accent ? 'bg-accent' : 'bg-brand-soft'}`} />
              <p className="mt-[22px] mb-0 text-sm leading-[1.65] text-muted">
                {s.body.map((part, j) =>
                  typeof part === 'string' ? (
                    part
                  ) : (
                    <strong key={j} className="font-bold text-fg">
                      {part.strong}
                    </strong>
                  ),
                )}
              </p>
            </Reveal>
          );
        })}
      </div>

      <Reveal
        as="p"
        delay={120}
        className="mx-auto mt-16 mb-0 max-w-[720px] text-[clamp(20px,2.3vw,26px)] leading-[1.35] font-bold tracking-[-0.015em]"
      >
        {IMPACT.quote.before}
        <span className="text-brand-soft">{IMPACT.quote.highlight}</span>
        {IMPACT.quote.after}
      </Reveal>
    </Section>
  );
}
