import { isAdmin } from '@/lib/auth/session';
import { toCsv } from '@/lib/csv';
import { listWaitlistForExport } from '@/lib/waitlist/queries';
import { adminFiltersSchema } from '@/lib/waitlist/validation';

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const { search, status } = adminFiltersSchema.parse({
    search: params.get('search') ?? undefined,
    status: params.get('status') ?? undefined,
  });

  try {
    const rows = await listWaitlistForExport({ search, status });
    const header = ['id', 'full_name', 'email', 'created_at', 'status', 'invite_sent'] as const;
    const csv = toCsv(
      header,
      rows.map((r) => [r.id, r.fullName, r.email, r.createdAt, r.status, r.inviteSent]),
    );
    const date = new Date().toISOString().slice(0, 10);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="vento-waitlist-${date}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[admin/export] export failed:', err);
    return Response.json({ error: 'Failed to export waitlist.' }, { status: 500 });
  }
}
