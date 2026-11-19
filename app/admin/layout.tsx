import type { Metadata } from 'next';
import { LogoMark } from '@/components/brand/Logo';

export const metadata: Metadata = {
  title: 'Vento — Waitlist Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1160px] px-6 pt-10 pb-20">
      <div className="mb-8 flex items-center gap-2.5">
        <LogoMark size={20} />
        <span className="text-[16.5px] font-bold">Vento</span>
        <span className="text-sm text-muted">&mdash; Waitlist Admin</span>
      </div>
      {children}
    </div>
  );
}
