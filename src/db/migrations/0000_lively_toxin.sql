CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"weekend_price" integer DEFAULT 0 NOT NULL,
	"weekday_price" integer DEFAULT 0 NOT NULL,
	"deposit" integer DEFAULT 0 NOT NULL,
	"rental_id" uuid NOT NULL,
	CONSTRAINT "tickets_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "rentals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"max_amount" integer DEFAULT 0 NOT NULL,
	"active" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "rentals_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_rental_id_rentals_id_fk" FOREIGN KEY ("rental_id") REFERENCES "public"."rentals"("id") ON DELETE no action ON UPDATE no action;