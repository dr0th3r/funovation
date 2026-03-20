CREATE TABLE "recipe_translation" (
	"recipe_id" integer NOT NULL,
	"locale" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"area" text NOT NULL,
	"cuisine" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recipe_translation_recipe_id_locale_pk" PRIMARY KEY("recipe_id","locale")
);
--> statement-breakpoint
ALTER TABLE "recipe_translation" ADD CONSTRAINT "recipe_translation_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;