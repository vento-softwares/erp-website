import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionIntro } from '@/components/ui/Section';
import { VISION } from './content';
import { Icon } from './icons';

export function Vision() {
  return (
    <Section id="vision" alt glow="radial-gradient(900px 420px at 78% 0%,rgb(0 45 74/.35),transparent 70%)">
      <SectionIntro
        eyebrow={VISION.eyebrow}
        title={VISION.title}
        lead={VISION.lead}
        titleMaxWidth="max-w-[640px]"
        leadMaxWidth="max-w-[560px]"
      />
      <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(255px,1fr))] gap-[18px]">
        {VISION.pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 110} className="card relative rounded-2xl px-[30px] py-8">
            <div className="flex items-center justify-between">
              <Icon name={p.icon} size={26} />
              <span className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="mt-[26px] mb-0 text-[19px] font-bold tracking-[-0.01em]">{p.title}</h3>
            <p className="mt-3 mb-0 text-[14.5px] leading-[1.65] text-muted">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
