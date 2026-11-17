# Vento — marketing site + waitlist

Next.js (App Router, TypeScript, Tailwind CSS v4) marketing site with a waitlist backed by **Neon** Postgres (via Drizzle ORM), **Loops** for email and **PostHog** for analytics. Deployed on Vercel.

## Project structure

```
app/
  layout.tsx, page.tsx, globals.css   Root layout, landing page, design tokens
  icon.svg                            Favicon
  admin/
    login/page.tsx                    Password login
    page.tsx                          Waitlist table (search, filter, paginate, edit)
    export/route.ts                   GET /admin/export -> CSV download
    actions.ts                        Server actions: login, logout, updateEntry
components/
  landing/                            One component per page section
    content.ts                        <- ALL landing-page copy lives here
    icons.tsx                         Line icons referenced by name from content.ts
  motion/                             Reveal-on-scroll, particles, magnetic buttons
  admin/                              Admin client components
  ui/Section.tsx                      Section wrapper, eyebrow + heading + lead
lib/
  env.ts                              Validated environment (fails loudly at startup)
  db/schema.ts, db/index.ts           Drizzle schema + Neon HTTP client
  waitlist/actions.ts                 joinWaitlist server action
  waitlist/validation.ts              Zod schemas shared by form and server
  waitlist/queries.ts                 Admin queries
  auth/                               Signed session cookie (jose)
  rate-limit.ts, turnstile.ts, loops.ts, csv.ts, analytics.ts
proxy.ts                              Redirects unauthenticated /admin requests
instrumentation.ts                    Validates env when the server boots
drizzle/                              Generated SQL migrations (commit these)
scripts/import-waitlist.ts            One-off CSV import (e.g. from Supabase)
```

### Common edits

| I want to… | Edit |
|---|---|
| Change copy, add a feature card or roadmap phase | `components/landing/content.ts` |
| Change a brand colour or animation | `@theme` block in `app/globals.css` |
| Change a section's layout | `components/landing/<Section>.tsx` |
| Change signup validation rules | `lib/waitlist/validation.ts` (used by both form and server) |
| Change the database schema | `lib/db/schema.ts`, then `yarn db:generate` and `yarn db:migrate` |

## Local setup

1. `yarn install`
2. `cp .env.example .env.local` and fill it in (see below). Next.js and drizzle-kit both read `.env.local`.
3. Create the table: `yarn db:migrate`
4. `yarn dev` → http://localhost:3000 (admin at `/admin`)

> The old `.env` (Supabase keys) is still loaded by Next.js if present. It's harmless, but delete it once you've migrated.

### Scripts

| Command | What it does |
|---|---|
| `yarn dev` / `yarn build` / `yarn start` | Next.js |
| `yarn lint` / `yarn typecheck` / `yarn test` | ESLint / `tsc` / Vitest unit tests |
| `yarn db:generate` | Create a migration from changes in `lib/db/schema.ts` |
| `yarn db:migrate` | Apply pending migrations to `DATABASE_URL` |
| `yarn db:studio` | Browse the database in Drizzle Studio |
| `yarn db:import <file.csv> [--commit]` | Import existing signups (dry run without `--commit`) |

## Services

### Neon
Create a project, then copy the **pooled** connection string (Connect → Pooled) into `DATABASE_URL`. Recommended: a `dev` branch for local work and `main` for production. With Neon's Vercel integration, every preview deployment can get its own branch automatically.

The `waitlist` table has a unique index on `lower(email)`, so `Ada@x.com` and `ada@x.com` count as the same signup. Emails are also lowercased before insert.

### Loops
Put the API key in `LOOPS_API_KEY`. In Loops, create a Loop triggered by the **`waitlist-joined`** event to send the welcome email. The sync runs after the response is sent (`after()`), and a Loops failure is logged but never fails the signup.

### PostHog
Set `NEXT_PUBLIC_POSTHOG_KEY` (and `NEXT_PUBLIC_POSTHOG_HOST` for the EU region). Only the public site is tracked, not `/admin`. Events (unchanged from the old site): `Page Viewed`, `Join Waitlist Button Clicked`, `Waitlist Signup Started`, `Waitlist Signup Successful`, `Waitlist Signup Failed`. Each includes `page_url` and `timestamp`.

### Upstash Redis (rate limiting)
With `UPSTASH_REDIS_REST_URL`/`TOKEN` set, signups are limited to 5/minute/IP and admin logins to 10/minute/IP across all instances. Without Upstash, limits are per serverless instance only. That's fine locally but weak in production.

### Cloudflare Turnstile (bot protection)
With `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` set, the waitlist form shows a Turnstile check that's verified server-side. Without them it's skipped. A hidden honeypot field is always active.

## Admin

Visit `/admin` and log in with `ADMIN_PASSWORD`. A successful login sets a signed, httpOnly session cookie (12 hours). From there you can:

- search by name/email, filter by status, and page through results (filters live in the URL, so views can be bookmarked)
- change `status` and toggle `invite sent` (saved immediately)
- export the current filtered view as CSV. Values that start with `= + - @` are defused against spreadsheet formula injection.

`proxy.ts` bounces unauthenticated requests, and every admin page, action and the export route also checks the session itself.

## Environment variables

| Variable | Required | Exposed to browser |
|---|---|---|
| `DATABASE_URL` | yes | no |
| `ADMIN_PASSWORD` (≥12 chars) | yes | no |
| `SESSION_SECRET` (≥32 chars) | yes | no |
| `LOOPS_API_KEY` | recommended | no |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | optional | yes (public by design) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | production | no |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | production | yes (public by design) |
| `TURNSTILE_SECRET_KEY` | production | no |

Missing or invalid required values stop the server at boot with a list of what's wrong (`lib/env.ts`).

## Deploying to Vercel

1. Import the repo. The framework is detected as Next.js, so no settings are needed.
2. Add the environment variables above for Production (and Preview).
3. Run `yarn db:migrate` against the production `DATABASE_URL` once before the first deploy (and after any new migration).

## Migrating existing signups from Supabase

1. Export the old table: either the old admin's **Export CSV** button, or Supabase → Table editor → `waitlist` → Export to CSV.
2. Dry run: `yarn db:import ./waitlist.csv`. This reports row counts, merged duplicates and invalid rows.
3. Import: `yarn db:import ./waitlist.csv --commit`. Original ids, timestamps and statuses are kept. Re-running is safe because existing emails are skipped.
