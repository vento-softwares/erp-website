CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text DEFAULT 'waiting' NOT NULL,
	"invite_sent" boolean DEFAULT false NOT NULL,
	CONSTRAINT "waitlist_status_check" CHECK ("waitlist"."status" in ('waiting', 'invited', 'joined'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_email_lower_key" ON "waitlist" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "waitlist_status_idx" ON "waitlist" USING btree ("status");--> statement-breakpoint
CREATE INDEX "waitlist_created_at_idx" ON "waitlist" USING btree ("created_at" DESC NULLS LAST);