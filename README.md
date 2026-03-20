# HOW TO RUN

```sh
cp .env.example .env
pnpm i
docker compose up -d
pnpm db:migrate
pnpm dev
```

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.12.8 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:none" drizzle="database:postgresql+postgresql:postgres.js+docker:yes" better-auth="demo:password" --install pnpm ./
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## API
### Random Meal Selection

The `/api/meals/randomselection` endpoint returns up to 10 randomly selected meals from the database that match your specified criteria. It gracefully handles comma-separated lists, multiple identical query parameters, and case-insensitivity.

#### Available Filters

- **`ingredients`** (or `includeIngredients`, `ingrediences`): Include meals containing **ANY** of these ingredients (OR condition).
- **`preferences`** (or `includePreferences`): Include meals matching **ALL** of these dietary preferences (AND condition). Options include: `vegan`, `vegetarian`, `gluten-free`, `lactose-free`.
- **`excludeAllergens`**: Filter out meals containing **ANY** of these EU standard allergen codes (1-14).
- **`excludeIngredients`** (or `excludeIngrediences`): Filter out meals containing **ANY** of these ingredients.
- **`excludeCuisines`**: Filter out meals matching these cuisines (e.g., `italian`, `mexican`).
- **`maxPricePerPortion`** (or `maxPricePerPortionCZK`): Returns meals costing less than or equal to this amount in CZK.

#### Example Usage

```text
GET /api/meals/randomselection?ingredients=chicken,beef&preferences=gluten-free&excludeAllergens=7&maxPricePerPortion=150
```

---

### Meal Names

Returns a list of all recipe names in the database.

```text
GET /api/meals/names
```
