CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'MEMBER');--> statement-breakpoint
CREATE TYPE "public"."poll_status" AS ENUM('ACTIVE', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."poll_type" AS ENUM('VOTE', 'APPLICATION', 'OPINION');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"nickname" varchar(50) NOT NULL,
	"role" "user_role" DEFAULT 'MEMBER' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"id" uuid PRIMARY KEY NOT NULL,
	"creator_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" "poll_type" NOT NULL,
	"status" "poll_status" DEFAULT 'ACTIVE' NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"is_multiple_choice" boolean DEFAULT false,
	"allow_custom_options" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "poll_options" (
	"id" uuid PRIMARY KEY NOT NULL,
	"poll_id" uuid NOT NULL,
	"content" varchar(255) NOT NULL,
	"added_by" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "poll_submissions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"poll_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "poll_submission_poll_user_unq" UNIQUE("poll_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "poll_submission_options" (
	"submission_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	CONSTRAINT "poll_submission_options_submission_id_option_id_pk" PRIMARY KEY("submission_id","option_id")
);
--> statement-breakpoint
ALTER TABLE "polls" ADD CONSTRAINT "polls_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_submissions" ADD CONSTRAINT "poll_submissions_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_submissions" ADD CONSTRAINT "poll_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_submission_options" ADD CONSTRAINT "poll_submission_options_submission_id_poll_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."poll_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_submission_options" ADD CONSTRAINT "poll_submission_options_option_id_poll_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."poll_options"("id") ON DELETE cascade ON UPDATE no action;