'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { adminHref } from '@/lib/admin-path';
import { createSession, destroySession, isAdmin, isCorrectPassword } from '@/lib/auth/session';
import { isLoginRateLimited } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';
import { updateWaitlistEntry } from '@/lib/waitlist/queries';
import { waitlistStatusSchema } from '@/lib/waitlist/validation';

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (await isLoginRateLimited(await getClientIp())) {
    return { error: 'Too many attempts. Please wait a minute and try again.' };
  }
  const password = formData.get('password');
  if (typeof password !== 'string' || !isCorrectPassword(password)) {
    return { error: 'Incorrect password.' };
  }
  await createSession();
  redirect(adminHref());
}

export async function logout() {
  await destroySession();
  redirect(adminHref('/login'));
}

const updateSchema = z
  .object({
    id: z.uuid(),
    status: waitlistStatusSchema.optional(),
    inviteSent: z.boolean().optional(),
  })
  .refine((v) => v.status !== undefined || v.inviteSent !== undefined, { message: 'Nothing to update.' });

export type UpdateEntryResult = { ok: true } | { ok: false; error: string };

export async function updateEntry(input: z.input<typeof updateSchema>): Promise<UpdateEntryResult> {
  if (!(await isAdmin())) return { ok: false, error: 'Your session has expired. Please log in again.' };

  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid update.' };

  const { id, ...updates } = parsed.data;
  try {
    const row = await updateWaitlistEntry(id, updates);
    if (!row) return { ok: false, error: 'That entry no longer exists.' };
  } catch (err) {
    console.error('[admin] update failed:', err);
    return { ok: false, error: 'Failed to save that change. Please retry.' };
  }

  // Route path (app/admin), not the public URL.
  revalidatePath('/admin');
  return { ok: true };
}
