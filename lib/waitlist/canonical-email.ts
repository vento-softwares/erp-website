// Domains whose mailboxes ignore dots in the local part (j.ohn == john).
const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

/**
 * Reduces an email to the mailbox it actually delivers to, so aliases of one
 * inbox count as a single waitlist signup:
 *   - case-insensitive:            Ada@X.com          -> ada@x.com
 *   - "+tag" sub-addressing:       ada+promo@x.com    -> ada@x.com
 *   - Gmail ignores dots:          a.d.a@gmail.com    -> ada@gmail.com
 *   - googlemail.com is Gmail:     ada@googlemail.com -> ada@gmail.com
 *
 * The stored `email` keeps what the person typed; only uniqueness uses this.
 * MUST stay in sync with the SQL backfill in drizzle/0001_*.sql.
 */
export function canonicalEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf('@');
  if (at < 1) return normalized;

  let local = normalized.slice(0, at);
  let domain = normalized.slice(at + 1);

  // Keep the local part as-is if "+" is its first character (nothing to strip to).
  local = local.split('+')[0] || local;

  if (GMAIL_DOMAINS.has(domain)) {
    domain = 'gmail.com';
    local = local.replaceAll('.', '') || local;
  }
  return `${local}@${domain}`;
}
