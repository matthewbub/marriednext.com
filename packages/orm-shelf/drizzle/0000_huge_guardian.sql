-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."rsvp_name_format" AS ENUM('FIRST_NAME_ONLY', 'FULL_NAME');--> statement-breakpoint
CREATE TYPE "public"."table_type" AS ENUM('square', 'rectangle', 'circle');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('spouse', 'family', 'planner');--> statement-breakpoint
CREATE TABLE "wedding" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subdomain" text,
	"custom_domain" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"field_display_name" text,
	"field_location_name" text,
	"field_location_address" text,
	"field_event_date" timestamp,
	"field_event_time" text,
	"field_maps_embed_url" text,
	"field_maps_share_url" text,
	"field_questions_and_answers" jsonb,
	"field_our_story" jsonb,
	"field_name_a" text,
	"field_name_b" text,
	"control_rsvp_name_format" "rsvp_name_format" DEFAULT 'FULL_NAME' NOT NULL,
	"created_by_clerk_user_id" text NOT NULL,
	"field_preferred_location_address_line_1" text,
	"field_preferred_location_address_line_2" text,
	"field_preferred_location_city" text,
	"field_preferred_location_state" text,
	"field_preferred_location_zip_code" text,
	"field_preferred_location_country" text,
	CONSTRAINT "weddings_subdomain_unique" UNIQUE("subdomain"),
	CONSTRAINT "wedding_subdomain_unique" UNIQUE("subdomain"),
	CONSTRAINT "weddings_custom_domain_unique" UNIQUE("custom_domain"),
	CONSTRAINT "wedding_custom_domain_unique" UNIQUE("custom_domain")
);
--> statement-breakpoint
CREATE TABLE "guest" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid,
	"date_entry_submitted" timestamp DEFAULT now(),
	"name_on_invitation" text NOT NULL,
	"is_attending" boolean,
	"has_plus_one" boolean,
	"invitation_id" uuid,
	CONSTRAINT "uq_guest_name" UNIQUE("name_on_invitation")
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_updated_at" timestamp DEFAULT now() NOT NULL,
	"invite_group_name" text,
	"email" text
);
--> statement-breakpoint
CREATE TABLE "wedding_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"clerk_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"role" "user_role" DEFAULT 'spouse' NOT NULL,
	CONSTRAINT "wedding_users_wedding_clerk_unique" UNIQUE("wedding_id","clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "collaborator_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"invited_email" text NOT NULL,
	"invited_by_name" text NOT NULL,
	"role" "user_role" NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp,
	"invitation_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seating_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"type" "table_type" NOT NULL,
	"x" real NOT NULL,
	"y" real NOT NULL,
	"table_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seat_assignment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_id" uuid NOT NULL,
	"guest_id" uuid NOT NULL,
	"seat_position" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_seat_assignment_table_guest" UNIQUE("table_id","guest_id")
);
--> statement-breakpoint
ALTER TABLE "guest" ADD CONSTRAINT "fk_guest_wedding" FOREIGN KEY ("wedding_id") REFERENCES "public"."wedding"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "guest" ADD CONSTRAINT "fk_guest_invitation" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitation"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "fk_invitation_wedding" FOREIGN KEY ("wedding_id") REFERENCES "public"."wedding"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "wedding_users" ADD CONSTRAINT "fk_wedding_users_wedding" FOREIGN KEY ("wedding_id") REFERENCES "public"."wedding"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "collaborator_invitations" ADD CONSTRAINT "fk_collaborator_invitations_wedding" FOREIGN KEY ("wedding_id") REFERENCES "public"."wedding"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "seating_table" ADD CONSTRAINT "fk_seating_table_wedding" FOREIGN KEY ("wedding_id") REFERENCES "public"."wedding"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "seat_assignment" ADD CONSTRAINT "fk_seat_assignment_table" FOREIGN KEY ("table_id") REFERENCES "public"."seating_table"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "seat_assignment" ADD CONSTRAINT "fk_seat_assignment_guest" FOREIGN KEY ("guest_id") REFERENCES "public"."guest"("id") ON DELETE cascade ON UPDATE cascade;
*/