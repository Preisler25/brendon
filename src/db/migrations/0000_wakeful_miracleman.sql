CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"weekend_price" integer DEFAULT 0 NOT NULL,
	"weekday_price" integer DEFAULT 0 NOT NULL,
	"deposit" integer DEFAULT 0 NOT NULL,
	"importance" integer NOT NULL,
	"rental_id" uuid,
	CONSTRAINT "tickets_name_unique" UNIQUE("name"),
	CONSTRAINT "tickets_importance_unique" UNIQUE("importance")
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
CREATE TABLE "logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cashier_id" integer NOT NULL,
	"date_of_purchase" timestamp DEFAULT now(),
	"total_amount" integer NOT NULL,
	"total_deposit" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day_id" uuid,
	"ticket_type_id" uuid,
	"quantity" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_rental_id_rentals_id_fk" FOREIGN KEY ("rental_id") REFERENCES "public"."rentals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_logs" ADD CONSTRAINT "ticket_logs_day_id_logs_id_fk" FOREIGN KEY ("day_id") REFERENCES "public"."logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_logs" ADD CONSTRAINT "ticket_logs_ticket_type_id_tickets_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;