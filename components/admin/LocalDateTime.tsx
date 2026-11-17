'use client';

/** Renders a timestamp in the viewer's own locale and timezone. */
export function LocalDateTime({ iso }: { iso: string }) {
  const d = new Date(iso);
  const text =
    d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  // The server renders in its own timezone; the client corrects it on hydrate.
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}
