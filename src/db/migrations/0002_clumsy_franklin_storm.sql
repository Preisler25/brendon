ALTER TABLE "tickets" DROP CONSTRAINT "tickets_importance_unique";--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "importance" SET DEFAULT 0;