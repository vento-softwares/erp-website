import { LogoMark } from '@/components/brand/Logo';
import { Reveal } from '@/components/motion/Reveal';
import { WAITLIST } from './content';
import { WaitlistForm } from './WaitlistForm';

export function WaitlistSection() {
  return (
    <section id="waitlist" className="relative px-gutter py-[clamp(130px,18vh,190px)] text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(880px 460px at 50% 112%,rgb(108 99 245/.16),transparent 70%),radial-gradient(600px 300px at 50% 118%,rgb(76 201 240/.07),transparent 70%)',
        }}
      />
      <div className="relative mx-auto flex max-w-[760px] flex-col items-center">
        <Reveal>
          <LogoMark size={34} strokeWidth={3} />
        </Reveal>
        <Reveal
          as="h2"
          delay={80}
          className="mt-[30px] mb-0 text-[clamp(32px,4.4vw,56px)] leading-[1.1] font-medium tracking-[-0.03em] text-balance"
        >
          {WAITLIST.title}
        </Reveal>
        <WaitlistForm />
      </div>
    </section>
  );
}
