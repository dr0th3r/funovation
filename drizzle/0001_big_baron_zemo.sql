CREATE TABLE "recipe" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"area" text NOT NULL,
	"cuisine" text NOT NULL,
	"image_url" text,
	"ingredients" jsonb NOT NULL,
	"simplified_ingredients" jsonb NOT NULL,
	"steps" jsonb NOT NULL,
	"preferences" jsonb NOT NULL,
	"price_per_portion_czk" integer NOT NULL,
	"allergens" jsonb NOT NULL,
	CONSTRAINT "recipe_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
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
