type LogoMarkProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
};

/** The Vento "V" mark. */
export function LogoMark({ size = 21, strokeWidth = 3.4, className }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path d="M5 7 L16 27 L27 7" stroke="#6C63F5" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="10" r="2.6" fill="#4CC9F0" />
    </svg>
  );
}

/** Mark + wordmark, as used in the header and footer. */
export function Logo({ size = 21, textClassName = 'text-[17px]' }: { size?: number; textClassName?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className={`font-bold tracking-[0.01em] text-fg ${textClassName}`}>Vento</span>
    </span>
  );
}
