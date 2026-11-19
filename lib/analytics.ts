import posthog from 'posthog-js';

// Event names are unchanged from the original site so existing PostHog
// insights and funnels keep working.
export type AnalyticsEvent =
  | 'Page Viewed'
  | 'Join Waitlist Button Clicked'
  | 'Waitlist Signup Started'
  | 'Waitlist Signup Successful'
  | 'Waitlist Signup Failed';

let ready = false;

export function initAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (ready || !key || typeof window === 'undefined') return;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  });
  ready = true;
  track('Page Viewed');
}

/** Ties this browser's anonymous PostHog person to the signup's email. */
export function identify(email: string, props?: Record<string, unknown>) {
  if (!ready) return;
  posthog.identify(email.trim().toLowerCase(), { email, ...props });
}

export function track(event: AnalyticsEvent, props?: Record<string, unknown>) {
  if (!ready) return;
  posthog.capture(event, {
    page_url: window.location.href,
    timestamp: new Date().toISOString(),
    ...props,
  });
}
