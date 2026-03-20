ALTER TABLE "recipe_translation" ADD COLUMN "ingredients" jsonb;--> statement-breakpoint
ALTER TABLE "recipe_translation" ADD COLUMN "simplified_ingredients" jsonb;--> statement-breakpoint
ALTER TABLE "recipe_translation" ADD COLUMN "steps" jsonb;