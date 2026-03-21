INSERT INTO "country" ("name") VALUES
	('China'),
	('France'),
	('Greece'),
	('India'),
	('Israel'),
	('Italy'),
	('Japan'),
	('Mexico'),
	('Russia'),
	('Sweden'),
	('Thailand'),
	('United States')
ON CONFLICT ("name") DO NOTHING;--> statement-breakpoint

ALTER TABLE "recipe" ADD COLUMN "cuisine_tmp" integer;--> statement-breakpoint

UPDATE "recipe" r
SET "cuisine_tmp" = c."id"
FROM "country" c
WHERE c."name" = CASE r."cuisine"
	WHEN 'Middle Eastern' THEN 'Israel'
	WHEN 'Japanese' THEN 'Japan'
	WHEN 'Indian' THEN 'India'
	WHEN 'Mexican' THEN 'Mexico'
	WHEN 'Nordic' THEN 'Sweden'
	WHEN 'Italian' THEN 'Italy'
	WHEN 'Thai' THEN 'Thailand'
	WHEN 'American' THEN 'United States'
	WHEN 'Chinese' THEN 'China'
	WHEN 'Mediterranean' THEN 'Greece'
	WHEN 'French' THEN 'France'
	WHEN 'Greek' THEN 'Greece'
	WHEN 'Russian' THEN 'Russia'
	ELSE NULL
END;--> statement-breakpoint

UPDATE "recipe" r
SET "cuisine_tmp" = c."id"
FROM "country" c
WHERE r."cuisine_tmp" IS NULL AND lower(c."name") = lower(r."cuisine");--> statement-breakpoint

ALTER TABLE "recipe" DROP COLUMN "cuisine";--> statement-breakpoint
ALTER TABLE "recipe" RENAME COLUMN "cuisine_tmp" TO "cuisine";--> statement-breakpoint
ALTER TABLE "recipe" ALTER COLUMN "cuisine" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_cuisine_country_id_fk" FOREIGN KEY ("cuisine") REFERENCES "public"."country"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

ALTER TABLE "recipe" DROP COLUMN "area";--> statement-breakpoint
ALTER TABLE "recipe_translation" DROP COLUMN "area";--> statement-breakpoint
ALTER TABLE "recipe_translation" DROP COLUMN "cuisine";