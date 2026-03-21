CREATE TABLE "country" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "country_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "country_translation" (
	"country_id" integer NOT NULL,
	"locale" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "country_translation_country_id_locale_pk" PRIMARY KEY("country_id","locale")
);
--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "countries" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "xp" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "country_translation" ADD CONSTRAINT "country_translation_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE cascade ON UPDATE no action;