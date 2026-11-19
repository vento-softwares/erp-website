import { z } from 'zod';
import { WAITLIST_STATUSES } from './constants';

// Shared by the waitlist form (client-side feedback) and the server action
// (the actual gate). Mirrors the rules of the original lib/validate.js.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const waitlistSignupSchema = z.object({
  fullName: z
    .string({ message: 'Full name is required.' })
    .trim()
    .min(2, 'Please enter your full name.')
    .max(120, 'Full name is too long.')
    // Strip characters with no legitimate place in a display name, so stored
    // data can never carry markup into the admin dashboard or outbound emails.
    .transform((name) => name.replace(/[<>]/g, '').trim())
    .pipe(z.string().min(2, 'Please enter your full name.')),
  email: z
    .string({ message: 'Email is required.' })
    .trim()
    .max(254, 'Please enter a valid email address.')
    .regex(EMAIL_RE, 'Please enter a valid email address.')
    .transform((email) => email.toLowerCase()),
});

export type WaitlistSignupInput = z.input<typeof waitlistSignupSchema>;
export type WaitlistSignup = z.output<typeof waitlistSignupSchema>;

export const waitlistStatusSchema = z.enum(WAITLIST_STATUSES);

export const adminFiltersSchema = z.object({
  search: z
    .string()
    .trim()
    .max(200)
    .optional()
    .catch(undefined)
    .transform((v) => (v ? v : undefined)),
  status: waitlistStatusSchema.optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(100_000).catch(1).default(1),
});

export type AdminFilters = z.output<typeof adminFiltersSchema>;

/** Escapes LIKE wildcards so a search for "50%" matches literally. */
export function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Invalid input.';
}
