import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionIntro } from '@/components/ui/Section';
import { FEATURES } from './content';
import { Icon } from './icons';

export function Features() {
  return (
    <Section id="features" glow="radial-gradient(900px 420px at 84% 8%,rgb(0 45 74/.32),transparent 70%)">
      <SectionIntro eyebrow={FEATURES.eyebrow} title={FEATURES.title} lead={FEATURES.lead} />
      <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {FEATURES.modules.map((m, i) => (
          // Cards stagger in rows of four.
          <Reveal key={m.title} delay={(i % 4) * 60} className="card rounded-[14px] px-6 py-[26px]">
            <Icon name={m.icon} />
            <h3 className="mt-5 mb-0 text-[17px] font-bold tracking-[-0.01em]">{m.title}</h3>
            <p className="mt-2.5 mb-0 text-[13.5px] leading-[1.6] text-muted">{m.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
