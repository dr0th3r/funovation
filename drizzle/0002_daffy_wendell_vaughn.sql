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
