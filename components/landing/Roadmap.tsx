import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionIntro } from '@/components/ui/Section';
import { ROADMAP } from './content';

type PhaseState = (typeof ROADMAP.phases)[number]['state'];

const markerClass: Record<PhaseState, string> = {
  current: 'border-accent shadow-[0_0_20px_rgb(76_201_240/.55)] flex items-center justify-center',
  next: 'border-[rgb(139_130_255/.6)]',
  future: 'border-[rgb(139_130_255/.35)]',
  vision: 'border-[rgb(158_165_181/.45)]',
};

const labelClass: Record<PhaseState, string> = {
  current: 'text-accent',
  next: 'text-brand-soft',
  future: 'text-brand-soft',
  vision: 'text-faint',
};

export function Roadmap() {
  return (
    <Section id="roadmap" glow="radial-gradient(1000px 460px at 18% 10%,rgb(0 45 74/.4),transparent 70%)">
      <SectionIntro
        eyebrow={ROADMAP.eyebrow}
        title={ROADMAP.title}
        lead={ROADMAP.lead}
        titleMaxWidth="max-w-[720px]"
        leadMaxWidth="max-w-[520px]"
      />

      <Reveal delay={240} className="relative mt-[72px] grid grid-cols-1 gap-7 min-[841px]:grid-cols-4">
        {/* Animated timeline connecting the phase markers (desktop only) */}
        <div
          aria-hidden
          className="animate-sheen absolute top-2 right-[calc(25%-10px)] left-2.5 hidden h-0.5 bg-linear-to-r from-brand via-brand-soft to-accent bg-size-[200%_100%] opacity-45 min-[841px]:block"
        />
        {ROADMAP.phases.map((phase) => (
          <div key={phase.label} className="relative flex flex-col items-start">
            <span className={`relative z-1 box-border size-[18px] rounded-full border-2 bg-panel ${markerClass[phase.state]}`}>
              {phase.state === 'current' && <span className="animate-pulse-dot-fast size-1.5 rounded-full bg-accent" />}
            </span>
            <span className={`mt-[22px] font-mono text-[10.5px] tracking-[.22em] ${labelClass[phase.state]}`}>{phase.label}</span>
            <h3 className="mt-3 mb-0 text-lg font-bold tracking-[-0.01em]">{phase.title}</h3>
            <p className="mt-[11px] mb-0 max-w-[250px] text-sm leading-[1.6] text-muted">{phase.body}</p>
          </div>
        ))}
      </Reveal>

      <Reveal as="p" delay={120} className="mt-[72px] mb-0 text-center text-[clamp(19px,2.2vw,24px)] font-bold tracking-[-0.015em]">
        One system. <span className="text-brand-soft">&middot;</span> Every industry. <span className="text-accent">&middot;</span> One
        vision.
      </Reveal>
    </Section>
  );
}
