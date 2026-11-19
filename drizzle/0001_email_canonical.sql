ALTER TABLE "waitlist" ADD COLUMN "email_canonical" text;--> statement-breakpoint
-- Backfill existing rows. Mirrors canonicalEmail() in lib/waitlist/canonical-email.ts:
-- lowercase, strip "+tag", and for Gmail drop dots and fold googlemail.com.
UPDATE "waitlist" AS w SET "email_canonical" =
	CASE WHEN p.domain IN ('gmail.com', 'googlemail.com')
		THEN coalesce(nullif(replace(p.local, '.', ''), ''), p.local) || '@gmail.com'
		ELSE p.local || '@' || p.domain
	END
FROM (
	SELECT "id",
		coalesce(nullif(split_part(split_part(lower(trim("email")), '@', 1), '+', 1), ''), split_part(lower(trim("email")), '@', 1)) AS local,
		split_part(lower(trim("email")), '@', 2) AS domain
	FROM "waitlist"
) AS p
WHERE w."id" = p."id";--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "email_canonical" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_email_canonical_key" ON "waitlist" USING btree ("email_canonical");--> statement-breakpoint
DROP INDEX "waitlist_email_lower_key";
