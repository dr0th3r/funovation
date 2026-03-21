CREATE TABLE "ingredient" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "ingredient_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ingredient_translation" (
	"ingredient_id" integer NOT NULL,
	"locale" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ingredient_translation_ingredient_id_locale_pk" PRIMARY KEY("ingredient_id","locale")
);
--> statement-breakpoint
INSERT INTO "ingredient" ("name")
SELECT DISTINCT jsonb_array_elements_text("simplified_ingredients")
FROM "recipe"
ON CONFLICT ("name") DO NOTHING;--> statement-breakpoint

INSERT INTO "ingredient_translation" ("ingredient_id", "locale", "name")
SELECT i."id", 'en', i."name"
FROM "ingredient" i
ON CONFLICT ("ingredient_id", "locale") DO NOTHING;--> statement-breakpoint

INSERT INTO "ingredient_translation" ("ingredient_id", "locale", "name")
SELECT DISTINCT i."id", 'cs', cs."name"
FROM "recipe" r
JOIN LATERAL jsonb_array_elements_text(r."simplified_ingredients") WITH ORDINALITY AS en("name", "ord") ON true
JOIN "recipe_translation" rt_cs ON rt_cs."recipe_id" = r."id" AND rt_cs."locale" = 'cs' AND rt_cs."simplified_ingredients" IS NOT NULL
JOIN LATERAL jsonb_array_elements_text(rt_cs."simplified_ingredients") WITH ORDINALITY AS cs("name", "ord") ON cs."ord" = en."ord"
JOIN "ingredient" i ON i."name" = en."name"
ON CONFLICT ("ingredient_id", "locale") DO NOTHING;--> statement-breakpoint

INSERT INTO "ingredient_translation" ("ingredient_id", "locale", "name")
SELECT DISTINCT i."id", 'th', th."name"
FROM "recipe" r
JOIN LATERAL jsonb_array_elements_text(r."simplified_ingredients") WITH ORDINALITY AS en("name", "ord") ON true
JOIN "recipe_translation" rt_th ON rt_th."recipe_id" = r."id" AND rt_th."locale" = 'th' AND rt_th."simplified_ingredients" IS NOT NULL
JOIN LATERAL jsonb_array_elements_text(rt_th."simplified_ingredients") WITH ORDINALITY AS th("name", "ord") ON th."ord" = en."ord"
JOIN "ingredient" i ON i."name" = en."name"
ON CONFLICT ("ingredient_id", "locale") DO NOTHING;--> statement-breakpoint

ALTER TABLE "recipe" ADD COLUMN "simplified_ingredients_tmp" integer[] NOT NULL DEFAULT '{}';--> statement-breakpoint

UPDATE "recipe" r
SET "simplified_ingredients_tmp" = COALESCE(
	(
		SELECT array_agg(i."id" ORDER BY en."ord")
		FROM jsonb_array_elements_text(r."simplified_ingredients") WITH ORDINALITY AS en("name", "ord")
		JOIN "ingredient" i ON i."name" = en."name"
	),
	'{}'::integer[]
);--> statement-breakpoint

ALTER TABLE "recipe" DROP COLUMN "simplified_ingredients";--> statement-breakpoint
ALTER TABLE "recipe" RENAME COLUMN "simplified_ingredients_tmp" TO "simplified_ingredients";--> statement-breakpoint

ALTER TABLE "ingredient_translation" ADD CONSTRAINT "ingredient_translation_ingredient_id_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("id") ON DELETE cascade ON UPDATE no action;