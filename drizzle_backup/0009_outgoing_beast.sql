ALTER TABLE "recipe" DROP CONSTRAINT "recipe_cuisine_country_id_fk";
--> statement-breakpoint
ALTER TABLE "recipe" ALTER COLUMN "cuisine" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "recipe" ADD COLUMN "time_length_minutes" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe_translation" ADD COLUMN "cuisine" text NOT NULL;