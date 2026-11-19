import { Logo } from '@/components/brand/Logo';
import { CONTACT_EMAIL, FOOTER } from './content';
import { PlaceholderLink } from './Links';

const columnHeading = 'font-mono text-[10.5px] tracking-[.24em] text-faint';
const linkClass = 'link-muted text-sm whitespace-nowrap';

export function SiteFooter() {
  return (
    <footer className="relative border-t border-fg/7 bg-linear-to-b from-ink to-ink-3 px-gutter pt-[68px] pb-10">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-wrap justify-between gap-14">
          <div className="flex max-w-[320px] flex-col gap-4">
            <Logo size={20} textClassName="text-[16.5px]" />
            <p className="m-0 text-[13.5px] leading-[1.65] text-muted">{FOOTER.blurb}</p>
            <a className="link-muted font-mono text-xs tracking-[.04em]" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="flex flex-wrap gap-[clamp(48px,7vw,96px)]">
            <nav aria-label="Explore" className="flex flex-col gap-3">
              <span className={columnHeading}>EXPLORE</span>
              {FOOTER.explore.map((l) => (
                <a key={l.label} className={linkClass} href={l.href}>
                  {l.label}
                </a>
              ))}
            </nav>
            <nav aria-label="Company" className="flex flex-col gap-3">
              <span className={columnHeading}>COMPANY</span>
              {FOOTER.company.map((l) =>
                l.href ? (
                  <a key={l.label} className={linkClass} href={l.href}>
                    {l.label}
                  </a>
                ) : (
                  <PlaceholderLink key={l.label} className={linkClass}>
                    {l.label}
                  </PlaceholderLink>
                ),
              )}
            </nav>
            {FOOTER.social.length > 0 && (
              <nav aria-label="Follow" className="flex flex-col gap-3">
                <span className={columnHeading}>FOLLOW</span>
                {FOOTER.social.map((l) => (
                  <a key={l.label} className={linkClass} href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>

        <div className="mt-[60px] flex flex-wrap justify-between gap-4 border-t border-fg/5 pt-6">
          <span className="font-mono text-[11px] text-faint">&copy; {new Date().getFullYear()} Vento. All rights reserved.</span>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[.14em] text-faint">
            <span className="animate-pulse-dot size-[5px] rounded-full bg-accent" />
            {FOOTER.tagline}
          </span>
        </div>
      </div>
    </footer>
  );
}
