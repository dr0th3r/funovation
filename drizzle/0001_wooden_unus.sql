CREATE TABLE "user_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"onboarding_step" integer DEFAULT 0 NOT NULL,
	"allergies" text[] DEFAULT '{}' NOT NULL,
	"dietary_restrictions" text[] DEFAULT '{}' NOT NULL,
	"budget_lunch_czk" integer,
	"budget_dinner_czk" integer,
	"disliked_foods" text[] DEFAULT '{}' NOT NULL,
	"goals" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
