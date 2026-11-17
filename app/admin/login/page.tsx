import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth/session';
import { LoginForm } from '@/components/admin/LoginForm';

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect('/admin');

  return (
    <div className="mx-auto mt-[12vh] max-w-[360px] text-center">
      <h1 className="m-0 text-2xl font-bold tracking-[-0.01em]">Admin access</h1>
      <p className="mt-2 mb-6 text-sm text-muted">Enter the admin password to view the waitlist.</p>
      <LoginForm />
    </div>
  );
}
