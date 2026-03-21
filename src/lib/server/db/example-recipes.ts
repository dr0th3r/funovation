export type Preference = 'gluten-free' | 'lactose-free' | 'vegetarian' | 'vegan';

export type ExampleRecipeSeed = {
	slug: string;
	name: string;
	category: string;
	cuisine: string;
	imageUrl: string | null;
	ingredients: string[];
	simplifiedIngredients: string[];
	steps: string[];
	timeLengthMinutes: number;
	preferences: Preference[];
	pricePerPortionCZK: number;
	allergens: string[];// EU standard codes (1-14)
};

export const EXAMPLE_RECIPES: ExampleRecipeSeed[] = [
	{
		slug: 'shakshuka',
		name: 'Shakshuka',
		category: 'Breakfast',
		cuisine: 'Middle Eastern',
		imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'2 tbsp olive oil',
			'1 onion, diced',
			'1 red bell pepper, diced',
			'3 garlic cloves, minced',
			'1 tsp cumin',
			'1 tsp smoked paprika',
			'400g crushed tomatoes',
			'4 eggs',
			'Salt and pepper',
			'Fresh parsley'
		],
		simplifiedIngredients: ['oil', 'onion', 'bell pepper', 'garlic', 'cumin', 'paprika', 'tomatoes', 'eggs', 'parsley', 'bread'],
		steps: [
			'Prep;Heat oil and saute onion and pepper until soft.',
			'Aromatics;Stir in garlic and spices for 30 seconds.',
			'Simmer;Add tomatoes, simmer 10 minutes, season to taste.',
			'Eggs;Make wells and crack eggs in, cover and cook until set.',
			'Serve;Garnish with parsley and serve with bread.'
		],
		timeLengthMinutes: 35,
		preferences: ['vegetarian', 'lactose-free'],
		pricePerPortionCZK: 45,
		allergens: ['1', '3'] // 1: Cereals (from served bread), 3: Eggs
	},
	{
		slug: 'chicken-teriyaki-bowl',
		name: 'Chicken Teriyaki Bowl',
		category: 'Dinner',
		cuisine: 'Japanese',
		imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'400g chicken thighs, sliced',
			'2 cups cooked rice',
			'1 tbsp neutral oil',
			'2 tbsp soy sauce',
			'1 tbsp mirin',
			'1 tbsp brown sugar',
			'1 tsp grated ginger',
			'1 tsp cornstarch + 2 tbsp water',
			'Steamed broccoli'
		],
		simplifiedIngredients: ['chicken', 'rice', 'oil', 'soy sauce', 'mirin', 'sugar', 'ginger', 'cornstarch', 'broccoli'],
		steps: [
			'Chicken;Sear chicken in oil until cooked through.',
			'Sauce;Add soy, mirin, sugar, and ginger;simmer briefly.',
			'Thicken;Stir in cornstarch slurry and cook until glossy.',
			'Serve;Serve over rice with steamed broccoli.'
		],
		timeLengthMinutes: 25,
		preferences: ['lactose-free'],
		pricePerPortionCZK: 75,
		allergens: ['1', '6'] // 1: Cereals (often in soy sauce), 6: Soybeans
	},
	{
		slug: 'lentil-coconut-curry',
		name: 'Lentil Coconut Curry',
		category: 'Vegetarian',
		cuisine: 'Indian',
		imageUrl: 'https://images.unsplash.com/photo-1565557612110-d8ab1f84d634?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'1 cup red lentils',
			'1 tbsp oil',
			'1 onion, chopped',
			'2 garlic cloves, minced',
			'1 tbsp curry powder',
			'1 tsp turmeric',
			'400ml coconut milk',
			'2 cups vegetable stock',
			'1 cup spinach',
			'Lime wedges'
		],
		simplifiedIngredients: ['lentils', 'oil', 'onion', 'garlic', 'curry powder', 'turmeric', 'coconut milk', 'vegetable stock', 'spinach', 'lime'],
		steps: [
			'Aromatics;Saute onion and garlic until fragrant.',
			'Spices;Bloom curry powder and turmeric for 30 seconds.',
			'Simmer;Add lentils, coconut milk, and stock;simmer 20 minutes.',
			'Greens;Fold in spinach and cook until wilted.',
			'Serve;Finish with lime and serve.'
		],
		timeLengthMinutes: 40,
		preferences: ['vegetarian', 'vegan', 'gluten-free', 'lactose-free'],
		pricePerPortionCZK: 40,
		allergens: ['9'] // 9: Celery (often in vegetable stock)
	},
	{
		slug: 'beef-taco-skillet',
		name: 'Beef Taco Skillet',
		category: 'Dinner',
		cuisine: 'Mexican',
		imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'400g ground beef',
			'1 onion, diced',
			'2 garlic cloves, minced',
			'1 tbsp taco seasoning',
			'1 cup black beans',
			'1 cup corn',
			'1 cup tomato sauce',
			'1 cup shredded cheese',
			'Tortilla chips or warm tortillas'
		],
		simplifiedIngredients: ['beef', 'onion', 'garlic', 'taco seasoning', 'beans', 'corn', 'tomatoes', 'cheese', 'tortillas'],
		steps: [
			'Beef;Brown beef with onion and garlic;drain excess fat.',
			'Mix;Add taco seasoning, beans, corn, and tomato sauce.',
			'Simmer;Simmer 8 minutes until thickened.',
			'Serve;Top with cheese, cover until melted, and serve.'
		],
		timeLengthMinutes: 25,
		preferences: ['gluten-free'], // Assuming corn tortillas
		pricePerPortionCZK: 85,
		allergens: ['7'] // 7: Milk
	},
	{
		slug: 'salmon-lemon-dill',
		name: 'Lemon Dill Salmon',
		category: 'Dinner',
		cuisine: 'Nordic',
		imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'4 salmon fillets',
			'1 tbsp olive oil',
			'1 lemon, sliced',
			'2 tbsp fresh dill',
			'2 garlic cloves, minced',
			'Salt and pepper'
		],
		simplifiedIngredients: ['salmon', 'oil', 'lemon', 'dill', 'garlic'],
		steps: [
			'Prep;Season salmon with salt and pepper.',
			'Flavor;Mix oil, garlic, and dill, then brush over salmon.',
			'Bake;Top with lemon slices and bake at 200C for 12-15 minutes.',
			'Serve;Serve with potatoes or salad.'
		],
		timeLengthMinutes: 20,
		preferences: ['gluten-free', 'lactose-free'],
		pricePerPortionCZK: 160,
		allergens: ['4'] // 4: Fish
	},
	{
		slug: 'spaghetti-aglio-olio',
		name: 'Spaghetti Aglio e Olio',
		category: 'Pasta',
		cuisine: 'Italian',
		imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'300g spaghetti',
			'4 tbsp olive oil',
			'4 garlic cloves, thinly sliced',
			'1 tsp chili flakes',
			'1/4 cup parsley, chopped',
			'Salt',
			'Parmesan (optional)'
		],
		simplifiedIngredients: ['pasta', 'oil', 'garlic', 'chili', 'parsley', 'cheese'],
		steps: [
			'Pasta;Cook spaghetti in salted water until al dente.',
			'Aromatics;Gently fry garlic in olive oil until lightly golden.',
			'Spice;Add chili flakes, then toss in drained pasta.',
			'Combine;Add a splash of pasta water and parsley;toss well.',
			'Serve;Serve immediately, optionally with parmesan.'
		],
		timeLengthMinutes: 20,
		preferences: ['vegetarian'],
		pricePerPortionCZK: 35,
		allergens: ['1', '7'] // 1: Cereals, 7: Milk (from Parmesan)
	},
	{
		slug: 'classic-margherita-pizza',
		name: 'Classic Margherita Pizza',
		category: 'Dinner',
		cuisine: 'Italian',
		imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'1 ball pizza dough',
			'1/2 cup San Marzano tomato sauce',
			'200g fresh mozzarella, torn',
			'1 handful fresh basil leaves',
			'1 tbsp extra virgin olive oil',
			'Salt'
		],
		simplifiedIngredients: ['pizza dough', 'tomatoes', 'cheese', 'basil', 'oil'],
		steps: [
			'Prep;Preheat oven to 250C with a pizza stone inside.',
			'Dough;Stretch dough into a 12-inch circle.',
			'Sauce;Spread tomato sauce evenly, leaving a border.',
			'Cheese;Top with mozzarella and a pinch of salt.',
			'Bake;Bake for 8-10 minutes until crust is blistered.',
			'Serve;Top with fresh basil and drizzle with olive oil before serving.'
		],
		timeLengthMinutes: 20, // Assumes premade/store-bought dough as listed in ingredients
		preferences: ['vegetarian'],
		pricePerPortionCZK: 65,
		allergens: ['1', '7'] // 1: Cereals, 7: Milk
	},
	{
		slug: 'thai-green-chicken-curry',
		name: 'Thai Green Chicken Curry',
		category: 'Dinner',
		cuisine: 'Thai',
		imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'400g chicken breast, sliced',
			'2 tbsp green curry paste',
			'400ml coconut milk',
			'1 cup bamboo shoots',
			'1 red bell pepper, sliced',
			'1 tbsp fish sauce',
			'1 tsp brown sugar',
			'Fresh basil leaves',
			'Cooked jasmine rice'
		],
		simplifiedIngredients: ['chicken', 'curry paste', 'coconut milk', 'bamboo shoots', 'bell pepper', 'fish sauce', 'sugar', 'basil', 'rice'],
		steps: [
			'Base;Fry green curry paste in a little coconut cream until fragrant.',
			'Chicken;Add chicken and cook until outside is white.',
			'Liquids;Pour in remaining coconut milk, fish sauce, and sugar.',
			'Simmer;Add bamboo shoots and bell pepper;simmer 15 minutes.',
			'Serve;Stir in basil and serve with jasmine rice.'
		],
		timeLengthMinutes: 30,
		preferences: ['gluten-free', 'lactose-free'],
		pricePerPortionCZK: 95,
		allergens: ['2', '4'] // 2: Crustaceans (usually in green curry paste), 4: Fish (fish sauce)
	},
	{
		slug: 'fluffy-buttermilk-pancakes',
		name: 'Fluffy Buttermilk Pancakes',
		category: 'Breakfast',
		cuisine: 'American',
		imageUrl: 'https://images.unsplash.com/photo-1575853121743-60c24f0a7502?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'2 cups all-purpose flour',
			'2 tbsp sugar',
			'2 tsp baking powder',
			'1/2 tsp baking soda',
			'1/2 tsp salt',
			'2 cups buttermilk',
			'2 eggs',
			'1/4 cup melted butter',
			'Butter and maple syrup for serving'
		],
		simplifiedIngredients: ['flour', 'sugar', 'baking powder', 'baking soda', 'buttermilk', 'eggs', 'butter', 'maple syrup'],
		steps: [
			'Dry;Whisk dry ingredients in a large bowl.',
			'Wet;In another bowl, whisk buttermilk, eggs, and melted butter.',
			'Mix;Gently fold wet ingredients into dry until just combined (lumps are fine).',
			'Cook;Cook 1/4 cup portions on a buttered skillet until bubbles form and pop.',
			'Serve;Flip and cook until golden. Serve with butter and syrup.'
		],
		timeLengthMinutes: 25,
		preferences: ['vegetarian'],
		pricePerPortionCZK: 35,
		allergens: ['1', '3', '7'] // 1: Cereals, 3: Eggs, 7: Milk
	},
	{
		slug: 'beef-and-broccoli-stir-fry',
		name: 'Beef and Broccoli Stir-Fry',
		category: 'Dinner',
		cuisine: 'Chinese',
		imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'400g flank steak, thinly sliced',
			'2 cups broccoli florets',
			'3 tbsp soy sauce',
			'1 tbsp oyster sauce',
			'1 tbsp sesame oil',
			'2 garlic cloves, minced',
			'1 tsp ginger, grated',
			'1 tbsp cornstarch',
			'2 tbsp vegetable oil'
		],
		simplifiedIngredients: ['beef', 'broccoli', 'soy sauce', 'oyster sauce', 'sesame oil', 'garlic', 'ginger', 'cornstarch', 'oil'],
		steps: [
			'Marinate;Toss beef with 1 tbsp soy sauce and cornstarch;let sit 10 mins.',
			'Sauce;Mix remaining soy sauce, oyster sauce, and sesame oil.',
			'Beef;Stir-fry beef in hot oil until browned, then remove from pan.',
			'Veggie;Add garlic, ginger, and broccoli to the pan;stir-fry 3 minutes.',
			'Combine;Return beef to pan, add sauce, and cook until thickened.'
		],
		timeLengthMinutes: 25,
		preferences: ['lactose-free'],
		pricePerPortionCZK: 110,
		allergens: ['1', '6', '11', '14'] // 1: Cereals (soy sauce), 6: Soybeans, 11: Sesame, 14: Molluscs (oyster sauce)
	},
	{
		slug: 'mediterranean-chickpea-salad',
		name: 'Mediterranean Chickpea Salad',
		category: 'Lunch',
		cuisine: 'Mediterranean',
		imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'1 can (400g) chickpeas, rinsed',
			'1 cucumber, diced',
			'1 cup cherry tomatoes, halved',
			'1/2 red onion, diced',
			'1/2 cup feta cheese, crumbled',
			'1/4 cup kalamata olives, pitted',
			'3 tbsp olive oil',
			'1 tbsp red wine vinegar',
			'1 tsp dried oregano'
		],
		simplifiedIngredients: ['chickpeas', 'cucumber', 'tomatoes', 'onion', 'cheese', 'olives', 'oil', 'vinegar', 'oregano'],
		steps: [
			'Prep;Combine chickpeas, cucumber, tomatoes, onion, and olives in a bowl.',
			'Dressing;Whisk olive oil, vinegar, oregano, salt, and pepper to make dressing.',
			'Mix;Pour dressing over the salad and toss to coat.',
			'Cheese;Gently fold in the feta cheese.',
			'Serve;Serve immediately or chill for 30 minutes to let flavors meld.'
		],
		timeLengthMinutes: 15,
		preferences: ['vegetarian', 'gluten-free'],
		pricePerPortionCZK: 55,
		allergens: ['7'] // 7: Milk
	},
	{
		slug: 'creamy-mushroom-risotto',
		name: 'Creamy Mushroom Risotto',
		category: 'Dinner',
		cuisine: 'Italian',
		imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'1.5 cups arborio rice',
			'300g mixed mushrooms, sliced',
			'1 onion, finely chopped',
			'2 garlic cloves, minced',
			'1/2 cup dry white wine',
			'4 cups warm chicken or vegetable broth',
			'1/2 cup parmesan cheese, grated',
			'2 tbsp butter',
			'2 tbsp olive oil'
		],
		simplifiedIngredients: ['rice', 'mushrooms', 'onion', 'garlic', 'wine', 'broth', 'cheese', 'butter', 'oil'],
		steps: [
			'Mushrooms;Sauté mushrooms in 1 tbsp oil until browned;remove and set aside.',
			'Aromatics;In the same pot, sauté onions and garlic in remaining oil until soft.',
			'Rice;Add rice and toast for 1 minute, then pour in wine and stir until absorbed.',
			'Broth;Add warm broth one ladle at a time, stirring constantly until absorbed.',
			'Finish;When rice is al dente, stir in mushrooms, butter, and parmesan.'
		],
		timeLengthMinutes: 45,
		preferences: ['vegetarian', 'gluten-free'],
		pricePerPortionCZK: 75,
		allergens: ['7', '9', '12'] // 7: Milk, 9: Celery (broth), 12: Sulphites (wine)
	},
	{
		slug: 'veggie-pad-thai',
		name: 'Veggie Pad Thai',
		category: 'Dinner',
		cuisine: 'Thai',
		imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'200g rice noodles',
			'2 eggs, beaten',
			'1 cup bean sprouts',
			'1/2 cup peanuts, crushed',
			'2 green onions, sliced',
			'3 tbsp pad thai sauce (tamarind based)',
			'2 tbsp neutral oil',
			'Lime wedges',
			'Cilantro for garnish'
		],
		simplifiedIngredients: ['pasta', 'eggs', 'bean sprouts', 'peanuts', 'onion', 'pad thai sauce', 'oil', 'lime', 'cilantro'],
		steps: [
			'Noodles;Soak rice noodles in warm water until pliable, then drain.',
			'Eggs;Heat oil in a wok, scramble eggs loosely, and push to the side.',
			'Sauce;Add noodles and pad thai sauce, tossing vigorously until noodles are soft.',
			'Mix-ins;Fold in bean sprouts, green onions, and half the peanuts.',
			'Serve;Serve immediately topped with remaining peanuts, cilantro, and lime.'
		],
		timeLengthMinutes: 35,
		preferences: ['vegetarian', 'gluten-free', 'lactose-free'],
		pricePerPortionCZK: 70,
		allergens: ['3', '5', '6'] // 3: Eggs, 5: Peanuts, 6: Soybeans (usually in pad thai sauce)
	},
	{
		slug: 'french-onion-soup',
		name: 'French Onion Soup',
		category: 'Starter',
		cuisine: 'French',
		imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'4 large yellow onions, thinly sliced',
			'3 tbsp butter',
			'1 tbsp olive oil',
			'1/2 cup dry sherry or white wine',
			'6 cups beef broth',
			'1 sprig fresh thyme',
			'1 baguette, sliced and toasted',
			'1.5 cups Gruyère cheese, grated'
		],
		simplifiedIngredients: ['onion', 'butter', 'oil', 'wine', 'beef broth', 'thyme', 'bread', 'cheese'],
		steps: [
			'Onions;Caramelize onions in butter and oil over medium-low heat for 40 mins.',
			'Deglaze;Deglaze the pot with sherry, scraping up browned bits.',
			'Simmer;Add beef broth and thyme;simmer for 20 minutes.',
			'Prep bowls;Ladle soup into oven-safe bowls and top with a toasted baguette slice.',
			'Broil;Cover generously with Gruyère and broil until cheese is bubbly and golden.'
		],
		timeLengthMinutes: 70,
		preferences: [],
		pricePerPortionCZK: 65,
		allergens: ['1', '7', '9', '12'] // 1: Cereals, 7: Milk, 9: Celery (broth), 12: Sulphites
	},
	{
		slug: 'greek-moussaka',
		name: 'Greek Moussaka',
		category: 'Dinner',
		cuisine: 'Greek',
		imageUrl: 'https://images.unsplash.com/photo-1627522460108-2144342a3f9e?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'2 large eggplants, sliced 1/2 inch thick',
			'400g ground lamb or beef',
			'1 onion, finely chopped',
			'2 garlic cloves, minced',
			'400g crushed tomatoes',
			'1 tsp ground cinnamon',
			'2 cups whole milk',
			'2 tbsp unsalted butter',
			'2 tbsp all-purpose flour',
			'1/2 cup parmesan cheese, grated'
		],
		simplifiedIngredients: ['eggplant', 'beef', 'onion', 'garlic', 'tomatoes', 'cinnamon', 'milk', 'butter', 'flour', 'cheese'],
		steps: [
			'Eggplant;Roast eggplant slices at 200°C for 20 minutes until tender.',
			'Meat;Brown meat with onion and garlic, then add tomatoes and cinnamon;simmer 20 minutes.',
			'Bechamel;Melt butter in a saucepan, whisk in flour, then slowly whisk in milk until thickened to make bechamel.',
			'Layer;Layer eggplant and meat sauce in a baking dish, topping with the bechamel sauce and parmesan cheese.',
			'Bake;Bake at 180°C for 45 minutes until the top is deeply golden and bubbling.'
		],
		timeLengthMinutes: 110,
		preferences: [],
		pricePerPortionCZK: 105,
		allergens: ['1', '7'] // 1: Cereals, 7: Milk
	},
	{
		slug: 'chicken-tikka-masala',
		name: 'Chicken Tikka Masala',
		category: 'Dinner',
		cuisine: 'Indian',
		imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'500g chicken breast, cut into bite-sized cubes',
			'1 cup plain yogurt',
			'2 tbsp garam masala',
			'1 large onion, diced',
			'3 garlic cloves, minced',
			'1 tbsp fresh ginger, grated',
			'400g tomato puree',
			'1 cup heavy cream',
			'Fresh cilantro for garnish'
		],
		simplifiedIngredients: ['chicken', 'yogurt', 'garam masala', 'onion', 'garlic', 'ginger', 'tomatoes', 'cream', 'cilantro'],
		steps: [
			'Marinate;Marinate chicken in yogurt and 1 tbsp of garam masala for at least 1 hour.',
			'Sear;Sear the marinated chicken in a hot pan until browned;remove and set aside.',
			'Aromatics;In the same pan, saute the diced onion, garlic, and ginger until soft and fragrant.',
			'Sauce;Add tomato puree, remaining garam masala, and heavy cream;simmer for 10 minutes.',
			'Simmer;Return chicken to the sauce, simmer until cooked through, and garnish with cilantro.'
		],
		timeLengthMinutes: 55, // 15 mins active prep/cook + roughly 40 mins total cooking, excluding idle marination time
		preferences: ['gluten-free'],
		pricePerPortionCZK: 95,
		allergens: ['7'] // 7: Milk
	},
	{
		slug: 'avocado-toast-poached-egg',
		name: 'Avocado Toast with Poached Egg',
		category: 'Breakfast',
		cuisine: 'American',
		imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'2 thick slices sourdough bread',
			'1 large ripe avocado',
			'2 large eggs',
			'1 tbsp white vinegar',
			'1/2 tsp red pepper flakes',
			'Salt and black pepper to taste',
			'1 tsp fresh lemon juice'
		],
		simplifiedIngredients: ['bread', 'avocado', 'eggs', 'vinegar', 'pepper', 'lemon'],
		steps: [
			'Toast;Toast the sourdough bread slices until golden and crisp.',
			'Avocado;In a small bowl, mash the avocado with lemon juice, salt, and pepper.',
			'Water;Bring a pot of water to a gentle simmer, add vinegar, and stir to create a vortex.',
			'Poach;Gently drop in eggs and poach for exactly 3 minutes;remove with a slotted spoon.',
			'Assemble;Spread avocado evenly on the toast, top with a poached egg, and sprinkle with red pepper flakes.'
		],
		timeLengthMinutes: 15,
		preferences: ['vegetarian', 'lactose-free'],
		pricePerPortionCZK: 55,
		allergens: ['1', '3'] // 1: Cereals, 3: Eggs
	},
	{
		slug: 'classic-miso-soup',
		name: 'Classic Miso Soup',
		category: 'Starter',
		cuisine: 'Japanese',
		imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4f43b4851?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'4 cups dashi stock',
			'3 tbsp white miso paste',
			'1 cup firm tofu, cut into small cubes',
			'2 green onions, thinly sliced',
			'1 tbsp dried wakame seaweed'
		],
		simplifiedIngredients: ['dashi', 'miso', 'tofu', 'onion', 'seaweed'],
		steps: [
			'Wakame;Rehydrate the dried wakame in a small bowl of water for 10 minutes, then drain well.',
			'Broth;Bring the dashi stock to a gentle simmer in a medium pot over medium heat.',
			'Miso;Place miso paste in a ladle, add a little hot stock to dissolve it smoothly, then stir the mixture back into the pot.',
			'Add-ins;Add the cubed tofu and rehydrated wakame, heating gently for 2 minutes without letting the soup boil.',
			'Serve;Garnish with sliced green onions and serve immediately while hot.'
		],
		timeLengthMinutes: 15,
		preferences: ['lactose-free', 'gluten-free'],
		pricePerPortionCZK: 35,
		allergens: ['4', '6'] // 4: Fish (from dashi), 6: Soybeans (from miso and tofu)
	},
	{
		slug: 'beef-stroganoff',
		name: 'Beef Stroganoff',
		category: 'Dinner',
		cuisine: 'Russian',
		imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'500g sirloin steak, sliced into thin strips',
			'300g cremini mushrooms, sliced',
			'1 yellow onion, chopped',
			'2 tbsp butter',
			'2 tbsp all-purpose flour',
			'2 cups beef broth',
			'1/2 cup sour cream',
			'1 tbsp Dijon mustard',
			'Cooked egg noodles for serving'
		],
		simplifiedIngredients: ['beef', 'mushrooms', 'onion', 'butter', 'flour', 'beef broth', 'sour cream', 'mustard', 'pasta'],
		steps: [
			'Beef;Quickly sear beef strips in a hot skillet with a little oil until browned;remove and set aside.',
			'Veggies;Melt butter in the same skillet, add chopped onions and mushrooms, cooking until soft and browned.',
			'Roux;Sprinkle in the flour and stir continuously for 1 minute to cook out the raw flour taste.',
			'Sauce;Gradually whisk in the beef broth and Dijon mustard, simmering until the sauce thickens.',
			'Serve;Remove from heat, stir in the sour cream and cooked beef, and serve warm over egg noodles.'
		],
		timeLengthMinutes: 30,
		preferences: [],
		pricePerPortionCZK: 125,
		allergens: ['1', '3', '7', '9', '10'] // 1: Cereals, 3: Eggs (egg noodles), 7: Milk, 9: Celery (broth), 10: Mustard
	},
	{
		slug: 'classic-caprese-salad',
		name: 'Classic Caprese Salad',
		category: 'Starter',
		cuisine: 'Italian',
		imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'3 large ripe tomatoes, sliced',
			'250g fresh mozzarella, sliced',
			'1 bunch fresh basil leaves',
			'3 tbsp extra virgin olive oil',
			'1 tbsp balsamic glaze',
			'Flaky sea salt and black pepper'
		],
		simplifiedIngredients: ['tomatoes', 'cheese', 'basil', 'oil', 'balsamic glaze'],
		steps: [
			'Layer;Alternate slices of tomato and mozzarella on a large serving platter.',
			'Basil;Tuck fresh basil leaves between the slices.',
			'Dress;Drizzle generously with extra virgin olive oil and balsamic glaze.',
			'Season;Season with flaky sea salt and freshly cracked black pepper right before serving.'
		],
		timeLengthMinutes: 10,
		preferences: ['vegetarian', 'gluten-free'],
		pricePerPortionCZK: 65,
		allergens: ['7'] // 7: Milk
	},
	{
		slug: 'tofu-vegetable-stir-fry',
		name: 'Tofu Vegetable Stir-Fry',
		category: 'Vegan',
		cuisine: 'Chinese',
		imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'400g extra firm tofu, pressed and cubed',
			'2 cups mixed vegetables (bell peppers, snap peas, carrots)',
			'2 tbsp soy sauce',
			'1 tbsp hoisin sauce',
			'1 tsp sesame oil',
			'1 inch ginger, grated',
			'2 cloves garlic, minced',
			'2 tbsp vegetable oil'
		],
		simplifiedIngredients: ['tofu', 'vegetables', 'soy sauce', 'hoisin', 'sesame oil', 'ginger', 'garlic', 'oil'],
		steps: [
			'Tofu;Pan-fry tofu cubes in 1 tbsp of vegetable oil until golden and crispy on all sides, then remove from pan.',
			'Veggies;Add the remaining oil and stir-fry the mixed vegetables, ginger, and garlic for 3-4 minutes.',
			'Sauce;Whisk together soy sauce, hoisin sauce, and sesame oil in a small bowl.',
			'Combine;Return the tofu to the pan, pour the sauce over the mixture, and toss to coat evenly.',
			'Serve;Cook for another 2 minutes until the sauce is bubbly and serve hot.'
		],
		timeLengthMinutes: 25,
		preferences: ['vegan', 'vegetarian', 'lactose-free'],
		pricePerPortionCZK: 50,
		allergens: ['1', '6', '11'] // 1: Cereals (soy/hoisin sauce), 6: Soybeans, 11: Sesame
	},
	{
		slug: 'bbq-pulled-pork',
		name: 'BBQ Pulled Pork',
		category: 'Dinner',
		cuisine: 'American',
		imageUrl: 'https://images.unsplash.com/photo-1629236715174-87428f522883?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'1.5kg pork shoulder',
			'2 tbsp smoked paprika',
			'1 tbsp brown sugar',
			'1 tsp garlic powder',
			'1 tsp onion powder',
			'1 cup BBQ sauce',
			'1/2 cup apple cider vinegar',
			'1/2 cup chicken broth',
			'Hamburger buns for serving'
		],
		simplifiedIngredients: ['pork', 'paprika', 'sugar', 'garlic', 'onion', 'bbq sauce', 'vinegar', 'chicken broth', 'bread'],
		steps: [
			'Rub;Rub the pork shoulder evenly with smoked paprika, brown sugar, garlic powder, onion powder, salt, and pepper.',
			'Prep;Place the pork in a slow cooker along with the apple cider vinegar and chicken broth.',
			'Cook;Cook on low for 8 hours or until the meat is incredibly tender and falling apart.',
			'Shred;Shred the pork using two forks, discarding any large pieces of fat.',
			'Serve;Stir in the BBQ sauce and serve warm on hamburger buns.'
		],
		timeLengthMinutes: 490, // 10 mins prep + 480 mins (8 hours) cooking
		preferences: ['lactose-free'],
		pricePerPortionCZK: 85,
		allergens: ['1', '9', '10'] // 1: Cereals (buns), 9: Celery (broth), 10: Mustard (often in BBQ sauce)
	},
	{
		slug: 'garlic-shrimp-scampi',
		name: 'Garlic Shrimp Scampi',
		category: 'Dinner',
		cuisine: 'Italian',
		imageUrl: 'https://images.unsplash.com/photo-1625944230945-1b7dd12a8fee?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'400g large shrimp, peeled and deveined',
			'250g linguine pasta',
			'4 tbsp unsalted butter',
			'2 tbsp olive oil',
			'4 cloves garlic, minced',
			'1/2 cup dry white wine',
			'1/4 cup fresh parsley, chopped',
			'Juice of 1 lemon',
			'1/2 tsp red pepper flakes'
		],
		simplifiedIngredients: ['shrimp', 'pasta', 'butter', 'oil', 'garlic', 'wine', 'parsley', 'lemon', 'pepper'],
		steps: [
			'Pasta;Boil linguine in salted water according to package directions until al dente.',
			'Base;Melt 2 tbsp butter and olive oil in a large skillet over medium heat.',
			'Aromatics;Add garlic and red pepper flakes, sautéing for 1 minute until fragrant.',
			'Shrimp;Add the shrimp and cook until pink, about 2 minutes per side, then remove from skillet.',
			'Sauce;Pour in white wine and lemon juice, simmering to reduce slightly, then swirl in remaining butter and toss with pasta, shrimp, and parsley.'
		],
		timeLengthMinutes: 20,
		preferences: [],
		pricePerPortionCZK: 145,
		allergens: ['1', '2', '7', '12'] // 1: Cereals, 2: Crustaceans, 7: Milk, 12: Sulphites
	},
	{
		slug: 'tom-yum-goong',
		name: 'Tom Yum Goong',
		category: 'Starter',
		cuisine: 'Thai',
		imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4f43b4851?auto=format&fit=crop&w=800&q=80',
		ingredients: [
			'4 cups chicken or vegetable broth',
			'2 stalks lemongrass, bruised and cut into 2-inch pieces',
			'4 kaffir lime leaves, torn',
			'1 inch galangal or ginger, sliced',
			'200g mushrooms, quartered',
			'300g medium shrimp, peeled',
			'3 tbsp fish sauce',
			'2 tbsp Thai chili paste (Nam Prik Pao)',
			'1/4 cup fresh lime juice'
		],
		simplifiedIngredients: ['broth', 'lemongrass', 'lime leaves', 'ginger', 'mushrooms', 'shrimp', 'fish sauce', 'chili paste', 'lime'],
		steps: [
			'Broth;Bring the broth to a boil in a pot and add lemongrass, kaffir lime leaves, and galangal;simmer for 5 minutes.',
			'Mushrooms;Stir in the mushrooms and Thai chili paste, cooking for another 3 minutes.',
			'Shrimp;Add the shrimp and cook just until they turn pink and opaque, about 2-3 minutes.',
			'Flavor;Remove from heat and stir in the fish sauce and fresh lime juice.',
			'Serve;Taste and adjust seasoning, then ladle into bowls, discarding the woody aromatics before eating.'
		],
		timeLengthMinutes: 30,
		preferences: ['gluten-free', 'lactose-free'],
		pricePerPortionCZK: 110,
		allergens: ['2', '4', '9'] // 2: Crustaceans (shrimp, chili paste), 4: Fish (fish sauce), 9: Celery (broth)
	}
];
