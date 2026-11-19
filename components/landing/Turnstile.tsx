'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Props = {
  siteKey: string;
  onToken: (token: string | undefined) => void;
  /** Change this value to get a fresh token (tokens are single-use). */
  resetKey: number;
};

/** Cloudflare Turnstile bot check, rendered explicitly so React controls it. */
export function Turnstile({ siteKey, onToken, resetKey }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const [loaded, setLoaded] = useState(() => typeof window !== 'undefined' && Boolean(window.turnstile));

  useEffect(() => {
    onTokenRef.current = onToken;
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!loaded || !el || !window.turnstile) return;
    const id = window.turnstile.render(el, {
      sitekey: siteKey,
      theme: 'dark',
      callback: (token: string) => onTokenRef.current(token),
      'expired-callback': () => onTokenRef.current(undefined),
      'error-callback': () => onTokenRef.current(undefined),
    });
    widgetId.current = id;
    return () => {
      window.turnstile?.remove(id);
      widgetId.current = null;
    };
  }, [loaded, siteKey]);

  useEffect(() => {
    if (resetKey && widgetId.current && window.turnstile) {
      onTokenRef.current(undefined);
      window.turnstile.reset(widgetId.current);
    }
  }, [resetKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setLoaded(true)}
      />
      <div ref={containerRef} className="mt-4 flex min-h-[65px] justify-center" />
    </>
  );
}
