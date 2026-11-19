import Link from 'next/link';
import { redirect } from 'next/navigation';
import { logout } from './actions';
import { adminHref } from '@/lib/admin-path';
import { isAdmin } from '@/lib/auth/session';
import { ADMIN_PAGE_SIZE, listWaitlist } from '@/lib/waitlist/queries';
import { adminFiltersSchema, type AdminFilters } from '@/lib/waitlist/validation';
import { Filters } from '@/components/admin/Filters';
import { InviteToggle, StatusSelect } from '@/components/admin/RowControls';
import { LocalDateTime } from '@/components/admin/LocalDateTime';
import { adminGhostButton } from '@/components/admin/styles';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function hrefFor(filters: AdminFilters, page: number, base = adminHref()) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.status) params.set('status', filters.status);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  if (!(await isAdmin())) redirect(adminHref('/login'));

  const raw = await searchParams;
  const filters = adminFiltersSchema.parse({
    search: typeof raw.search === 'string' ? raw.search : undefined,
    status: typeof raw.status === 'string' ? raw.status : undefined,
    page: typeof raw.page === 'string' ? raw.page : undefined,
  });

  const { rows, total } = await listWaitlist(filters);
  const pages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-2xl font-bold tracking-[-0.01em]">Waitlist</h1>
        <div className="flex gap-3">
          {/* Plain link: the session cookie is sent and the response downloads as a file. */}
          <a className={adminGhostButton} href={hrefFor({ ...filters, page: 1 }, 1, adminHref('/export'))}>
            Export CSV
          </a>
          <form action={logout}>
            <button type="submit" className={adminGhostButton}>
              Log out
            </button>
          </form>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <Filters basePath={adminHref()} search={filters.search ?? ''} status={filters.status ?? ''} />
        <span className="ml-auto font-mono text-xs text-faint">
          {total} signup{total === 1 ? '' : 's'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr>
              {['Name', 'Email', 'Joined', 'Status', 'Invite sent'].map((h) => (
                <th
                  key={h}
                  className="border-b border-fg/8 px-3 py-2.5 text-left font-mono text-[10.5px] font-normal tracking-widest whitespace-nowrap text-faint uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-fg/2">
                <td className="border-b border-fg/5 p-3">{row.fullName}</td>
                <td className="border-b border-fg/5 p-3 font-mono text-[11.5px] text-faint">{row.email}</td>
                <td className="border-b border-fg/5 p-3 whitespace-nowrap text-muted">
                  <LocalDateTime iso={row.createdAt.toISOString()} />
                </td>
                <td className="border-b border-fg/5 p-3">
                  <StatusSelect id={row.id} status={row.status} />
                </td>
                <td className="border-b border-fg/5 p-3">
                  <InviteToggle id={row.id} inviteSent={row.inviteSent} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="py-[60px] text-center text-sm text-faint">No signups match these filters.</div>}
      </div>

      <nav aria-label="Pagination" className="mt-[18px] flex items-center justify-end gap-2.5 text-[13px] text-muted">
        <span>
          Page {Math.min(filters.page, pages)} of {pages}
        </span>
        <PagerLink href={hrefFor(filters, filters.page - 1)} disabled={filters.page <= 1}>
          &larr; Prev
        </PagerLink>
        <PagerLink href={hrefFor(filters, filters.page + 1)} disabled={filters.page >= pages}>
          Next &rarr;
        </PagerLink>
      </nav>
    </>
  );
}

function PagerLink({ href, disabled, children }: { href: string; disabled: boolean; children: React.ReactNode }) {
  const cls = 'rounded-[7px] border border-fg/14 px-3 py-1.5 text-fg';
  if (disabled) {
    return (
      <span aria-disabled className={`${cls} cursor-not-allowed opacity-40`}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
