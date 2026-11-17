import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionIntro } from '@/components/ui/Section';
import { FUTURE } from './content';
import { Icon } from './icons';

export function Future() {
  return (
    <Section
      id="future"
      alt
      glow="radial-gradient(900px 420px at 50% 0%,rgb(0 45 74/.35),transparent 70%)"
      innerClassName="text-center"
    >
      <SectionIntro eyebrow={FUTURE.eyebrow} tone="accent" title={FUTURE.title} lead={FUTURE.lead} centered leadMaxWidth="max-w-[600px]" />

      <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[18px]">
        {FUTURE.ideas.map((idea, i) => (
          <Reveal key={idea.title} delay={i * 110} className="card rounded-2xl px-[30px] py-[42px]">
            <div className="mx-auto flex size-[52px] items-center justify-center rounded-full border border-[rgb(139_130_255/.25)] bg-[rgb(108_99_245/.1)]">
              <Icon name={idea.icon} size={22} />
            </div>
            <h3 className="mt-6 mb-0 text-lg font-bold tracking-[-0.01em]">{idea.title}</h3>
            <p className="mt-3 mb-0 text-sm leading-[1.65] text-muted">{idea.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="mx-auto mt-16 max-w-[760px]">
        <div className="mx-auto h-0.5 w-[34px] rounded-[2px] bg-brand-soft" />
        <p className="mt-7 mb-0 text-[clamp(20px,2.3vw,26px)] leading-[1.4] font-bold tracking-[-0.015em] italic">
          {FUTURE.quote.before}
          <span className="text-brand-soft">{FUTURE.quote.highlight}</span>
          {FUTURE.quote.after}
        </p>
      </Reveal>
    </Section>
  );
}
