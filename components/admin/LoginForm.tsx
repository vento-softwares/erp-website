'use client';

import { useActionState } from 'react';
import { login, type LoginState } from '@/app/admin/actions';
import { adminButton, adminField } from './styles';

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction}>
      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        aria-label="Admin password"
        required
        autoFocus
        className={`${adminField} w-full`}
      />
      <button type="submit" disabled={pending} className={`${adminButton} mt-3 w-full`}>
        {pending ? 'Checking…' : 'Unlock'}
      </button>
      <div role="alert" className="mt-3 min-h-[18px] text-[13px] text-danger">
        {state.error}
      </div>
    </form>
  );
}
