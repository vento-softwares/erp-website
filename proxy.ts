import { NextResponse, type NextRequest } from 'next/server';
import { adminBase, adminHref, INTERNAL_ADMIN_BASE } from '@/lib/admin-path';
import { SESSION_COOKIE } from '@/lib/auth/constants';
import { verifySessionToken } from '@/lib/auth/token';

const NO_INDEX = 'noindex, nofollow';

function underBase(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

/** Renders the normal 404 page (rewriting to a route that doesn't exist). */
function notFound(request: NextRequest) {
  return NextResponse.rewrite(new URL('/__not-found', request.url));
}

// 1. Hides the admin area behind ADMIN_PATH (see lib/admin-path.ts).
// 2. Optimistic auth gate: unauthenticated visitors are bounced to the login
//    page. Pages, actions and the export route re-check the session
//    themselves (lib/auth/session.ts#isAdmin), so this is not the only guard.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const base = adminBase();
  const hidden = base !== INTERNAL_ADMIN_BASE;

  if (hidden && underBase(pathname, INTERNAL_ADMIN_BASE)) return notFound(request);
  if (!underBase(pathname, base)) return NextResponse.next();

  const subpath = pathname.slice(base.length); // "", "/login", "/export"
  const pass = () => {
    const res = hidden
      ? NextResponse.rewrite(new URL(`${INTERNAL_ADMIN_BASE}${subpath}${search}`, request.url))
      : NextResponse.next();
    res.headers.set('X-Robots-Tag', NO_INDEX);
    return res;
  };

  if (subpath === '/login') return pass();
  if (await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return pass();

  if (subpath.startsWith('/export')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return NextResponse.redirect(new URL(adminHref('/login'), request.url));
}

export const config = {
  // The admin path comes from an env var, so it can't be listed statically:
  // run on every page request and skip static assets.
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg).*)'],
};
