// Line icons used across the landing page. Brand = #8B82FF, accent = #4CC9F0.
const B = '#8B82FF';
const A = '#4CC9F0';
const sw = 1.6;

const icons = {
  // Vision
  layers: (
    <>
      <rect x="3.5" y="3.5" width="10" height="10" rx="2.5" stroke={B} strokeWidth={sw} />
      <rect x="10.5" y="10.5" width="10" height="10" rx="2.5" stroke={A} strokeWidth={sw} />
    </>
  ),
  gauge: (
    <>
      <circle cx="12" cy="12" r="8.5" stroke={B} strokeWidth={sw} />
      <path d="M12 12 L17.5 6.5" stroke={A} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.2" fill={A} />
    </>
  ),
  lines: (
    <>
      <path d="M4 7 H20" stroke={B} strokeWidth={sw} strokeLinecap="round" />
      <path d="M4 12 H14" stroke={B} strokeWidth={sw} strokeLinecap="round" />
      <path d="M4 17 H9" stroke={A} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  // Features
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke={B} strokeWidth={sw} />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke={B} strokeWidth={sw} />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke={B} strokeWidth={sw} />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke={A} strokeWidth={sw} />
    </>
  ),
  inventory: (
    <>
      <rect x="4" y="7" width="16" height="13" rx="2" stroke={B} strokeWidth={sw} />
      <path d="M4 11 H20" stroke={B} strokeWidth={sw} />
      <path d="M10 15.5 H14" stroke={A} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  cart: (
    <>
      <path d="M4 5.5 H6.5 L8.5 14.5 H17.5 L19.5 8 H7.2" stroke={B} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.6" cy="18.6" r="1.5" fill={A} />
      <circle cx="16.4" cy="18.6" r="1.5" fill={A} />
    </>
  ),
  hexagon: (
    <>
      <path d="M12 3.5 L19.4 7.75 V16.25 L12 20.5 L4.6 16.25 V7.75 Z" stroke={B} strokeWidth={sw} strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.3" fill={A} />
    </>
  ),
  tag: (
    <>
      <path d="M4 11.5 L11.5 4 H20 V12.5 L12.5 20 Z" stroke={B} strokeWidth={sw} strokeLinejoin="round" />
      <circle cx="16" cy="8" r="1.5" fill={A} />
    </>
  ),
  calculator: (
    <>
      <rect x="5.5" y="3.5" width="13" height="17" rx="2" stroke={B} strokeWidth={sw} />
      <path d="M9 7.5 H15" stroke={B} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="9" cy="12" r="1" fill={B} />
      <circle cx="15" cy="12" r="1" fill={B} />
      <circle cx="9" cy="16" r="1" fill={B} />
      <circle cx="15" cy="16" r="1" fill={A} />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8.5" r="3.5" stroke={B} strokeWidth={sw} />
      <path d="M5 19.5 C5.5 15.8 8.5 14 12 14 C15.5 14 18.5 15.8 19 19.5" stroke={A} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  report: (
    <>
      <rect x="5.5" y="3.5" width="13" height="17" rx="2" stroke={B} strokeWidth={sw} />
      <path d="M9 9 H15" stroke={B} strokeWidth={sw} strokeLinecap="round" />
      <path d="M9 13 H15" stroke={B} strokeWidth={sw} strokeLinecap="round" />
      <path d="M9 17 H12" stroke={A} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  // Future
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" stroke={B} strokeWidth={sw} />
      <path d="M15.8 15.8 L20 20" stroke={A} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 8.5 H16.5 M13.5 5 L17 8.5 L13.5 12" stroke={B} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 15.5 H7.5 M10.5 12 L7 15.5 L10.5 19" stroke={A} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  network: (
    <>
      <circle cx="6" cy="18" r="2" stroke={B} strokeWidth={sw} />
      <circle cx="12" cy="6" r="2" stroke={B} strokeWidth={sw} />
      <circle cx="18" cy="18" r="2" fill={A} />
      <path d="M7 16.2 L11 7.8 M13 7.8 L17 16.2 M8 18 H16" stroke={B} strokeWidth="1.2" />
    </>
  ),
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}
