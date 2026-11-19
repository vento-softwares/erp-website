'use client';

import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { useWindowFrame } from '@/components/motion/hooks';
import { NAV_LINKS } from './content';
import { CtaLink } from './Links';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  useWindowFrame(['scroll'], () => setScrolled(window.scrollY > 28));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-80 flex items-center justify-between gap-5 border-b px-[clamp(20px,4.5vw,52px)] py-4 transition-[background-color,border-color,backdrop-filter] duration-[450ms] ${
        scrolled ? 'border-fg/7 bg-ink/68 backdrop-blur-[16px]' : 'border-transparent bg-transparent'
      }`}
    >
      <a href="#top" aria-label="Vento home">
        <Logo />
      </a>
      <nav className="flex items-center gap-[34px] max-[840px]:hidden">
        {NAV_LINKS.map((l) => (
          <a key={l.href} className="link-muted text-[14.5px] font-medium whitespace-nowrap" href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <CtaLink className="btn-primary-sm">Join the Waitlist</CtaLink>
    </header>
  );
}
