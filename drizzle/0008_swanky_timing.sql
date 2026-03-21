ALTER TABLE "recipe" ADD COLUMN "time_length_minutes" integer NOT NULL DEFAULT 30;--> statement-breakpoint

UPDATE "recipe"
SET "time_length_minutes" = CASE "slug"
	WHEN 'shakshuka' THEN 25
	WHEN 'chicken-teriyaki-bowl' THEN 30
	WHEN 'lentil-coconut-curry' THEN 35
	WHEN 'beef-taco-skillet' THEN 30
	WHEN 'salmon-lemon-dill' THEN 25
	WHEN 'spaghetti-aglio-olio' THEN 20
	WHEN 'classic-margherita-pizza' THEN 35
	WHEN 'thai-green-chicken-curry' THEN 35
	WHEN 'fluffy-buttermilk-pancakes' THEN 25
	WHEN 'beef-and-broccoli-stir-fry' THEN 30
	WHEN 'mediterranean-chickpea-salad' THEN 15
	WHEN 'creamy-mushroom-risotto' THEN 45
	WHEN 'veggie-pad-thai' THEN 30
	WHEN 'french-onion-soup' THEN 70
	WHEN 'greek-moussaka' THEN 90
	WHEN 'chicken-tikka-masala' THEN 50
	WHEN 'avocado-toast-poached-egg' THEN 15
	WHEN 'classic-miso-soup' THEN 20
	WHEN 'beef-stroganoff' THEN 40
	WHEN 'classic-caprese-salad' THEN 10
	WHEN 'tofu-vegetable-stir-fry' THEN 25
	WHEN 'bbq-pulled-pork' THEN 240
	WHEN 'garlic-shrimp-scampi' THEN 25
	WHEN 'tom-yum-goong' THEN 30
	ELSE 30
END;--> statement-breakpoint

ALTER TABLE "recipe" ALTER COLUMN "time_length_minutes" DROP DEFAULT;
