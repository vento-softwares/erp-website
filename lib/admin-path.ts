// The admin pages live in app/admin, but when ADMIN_PATH is set they are only
// reachable at /<ADMIN_PATH>: proxy.ts rewrites that address to /admin and
// answers 404 for /admin itself. Obscurity on top of the password, not instead
// of it -- it just keeps the login page away from scanners probing /admin.
//
// No `server-only` import: proxy.ts uses this too. ADMIN_PATH has no
// NEXT_PUBLIC_ prefix, so it is never inlined into a browser bundle; client
// components get the base path as a prop from a server component.

/** Route the admin pages are defined under (the app/admin folder). */
export const INTERNAL_ADMIN_BASE = '/admin';

/** Public base path of the admin area, e.g. "/ops-k3v9x2m7q4" or "/admin". */
export function adminBase(): string {
  const segment = process.env.ADMIN_PATH?.trim();
  return segment ? `/${segment}` : INTERNAL_ADMIN_BASE;
}

/** Public URL of an admin page: adminHref('/login') -> "/<ADMIN_PATH>/login". */
export function adminHref(subpath = ''): string {
  return `${adminBase()}${subpath}`;
}
