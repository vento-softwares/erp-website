'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { identify, track } from '@/lib/analytics';
import { joinWaitlist } from '@/lib/waitlist/actions';
import { firstError, waitlistSignupSchema } from '@/lib/waitlist/validation';
import { Reveal } from '@/components/motion/Reveal';
import { WAITLIST } from './content';
import { Turnstile } from './Turnstile';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type View = 'form' | 'success' | 'duplicate';

function CheckIcon({ tone, animated }: { tone: 'accent' | 'brand'; animated?: boolean }) {
  const stroke = tone === 'accent' ? '#4CC9F0' : '#8B82FF';
  const ring = tone === 'accent' ? 'rgba(76,201,240,.4)' : 'rgba(139,130,255,.4)';
  return (
    <svg width="46" height="46" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="20" stroke={ring} strokeWidth="1.5" />
      <path
        d="M14 22.5 L19.5 28 L30 16.5"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'animate-draw-fast [stroke-dasharray:26] [stroke-dashoffset:26] motion-reduce:[stroke-dashoffset:0]' : undefined}
      />
    </svg>
  );
}

function Outcome({ tone, title, body }: { tone: 'accent' | 'brand'; title: string; body: string }) {
  return (
    <div role="status" className="mt-11 flex flex-col items-center gap-4">
      <CheckIcon tone={tone} animated={tone === 'accent'} />
      <div className="text-[21px] font-bold tracking-[-0.01em]">{title}</div>
      <p className="m-0 max-w-[400px] text-[14.5px] leading-[1.6] text-muted">{body}</p>
    </div>
  );
}

export function WaitlistForm() {
  const [view, setView] = useState<View>('form');
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const [turnstileReset, setTurnstileReset] = useState(0);

  if (view === 'success') return <Outcome tone="accent" {...WAITLIST.success} />;
  if (view === 'duplicate') return <Outcome tone="brand" {...WAITLIST.duplicate} />;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const data = new FormData(e.currentTarget);
    const input = {
      fullName: String(data.get('fullName') ?? ''),
      email: String(data.get('email') ?? ''),
      website: String(data.get('website') ?? ''),
      turnstileToken,
    };

    // Instant feedback; the server action re-validates with the same schema.
    const parsed = waitlistSignupSchema.safeParse(input);
    if (!parsed.success) {
      setMessage(firstError(parsed.error));
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setMessage('Please complete the verification below.');
      return;
    }

    setMessage('');
    track('Waitlist Signup Started');

    startTransition(async () => {
      try {
        const result = await joinWaitlist(input);
        if (result.status === 'success') {
          setView('success');
          identify(parsed.data.email, { name: parsed.data.fullName });
          track('Waitlist Signup Successful');
        } else if (result.status === 'duplicate') {
          setView('duplicate');
          track('Waitlist Signup Failed', { reason: 'duplicate' });
        } else {
          setMessage(result.message);
          setTurnstileReset((n) => n + 1);
          track('Waitlist Signup Failed', { reason: result.message });
        }
      } catch {
        setMessage('Network error. Please check your connection and try again.');
        setTurnstileReset((n) => n + 1);
        track('Waitlist Signup Failed', { reason: 'network' });
      }
    });
  }

  return (
    <div className="w-full">
      <Reveal
        as="form"
        delay={160}
        noValidate
        onSubmit={handleSubmit}
        className="mt-10 flex w-full flex-wrap justify-center gap-3"
      >
        <input
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Full name"
          aria-label="Full name"
          required
          maxLength={120}
          disabled={pending}
          className="field"
        />
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email address"
          aria-label="Email address"
          required
          maxLength={254}
          disabled={pending}
          className="field"
        />
        {/* Honeypot: invisible to people, tempting to bots. */}
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />
        <button type="submit" className="btn-primary px-7 py-[15px]" data-magnetic="" disabled={pending}>
          {pending ? <span className="spinner" aria-label="Submitting" /> : 'Join the Waitlist'}
        </button>
      </Reveal>

      {TURNSTILE_SITE_KEY && <Turnstile siteKey={TURNSTILE_SITE_KEY} onToken={setTurnstileToken} resetKey={turnstileReset} />}

      <div role="status" aria-live="polite" className="mt-4 min-h-[18px] font-mono text-xs tracking-[.06em] text-brand-soft">
        {message}
      </div>

      <Reveal as="p" delay={240} className="mx-auto mt-[22px] mb-0 max-w-[420px] text-[13.5px] leading-[1.6] text-faint">
        {WAITLIST.note}
      </Reveal>
    </div>
  );
}
