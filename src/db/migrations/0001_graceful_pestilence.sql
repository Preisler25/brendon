ALTER TABLE "tickets" ADD COLUMN "importance" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_importance_unique" UNIQUE("importance");