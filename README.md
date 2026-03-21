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

All endpoints support translation via an optional `locale` query parameter (e.g., `?locale=cs`). Supported values: `en` (default), `cs`, `th`.

---

### `GET /api/meals/randomselection`
Returns up to 10 random meals matching filters.

**Query Parameters:**
- `ingredients`, `includeIngredients`, `ingrediences`: Meals containing **any** of these ingredients (comma-separated or multi-param)
- `preferences`, `includePreferences`: Meals matching **all** of these dietary preferences (`vegan`, `vegetarian`, `gluten-free`, `lactose-free`)
- `excludeAllergens`: Exclude meals with **any** of these EU allergen codes (1-14)
- `excludeIngredients`, `excludeIngrediences`: Exclude meals with **any** of these ingredients
- `excludeCuisines`: Exclude cuisines (comma-separated)
- `maxPricePerPortion`, `maxPricePerPortionCZK`: Meals costing ≤ this value (CZK)
- `locale`: (optional)

**Example:**
```
GET /api/meals/randomselection?ingredients=chicken,beef&preferences=vegan&maxPricePerPortion=120
```

---

### `GET /api/meals/names`
List all recipe names, translated.

**Query Parameters:** `locale` (optional)
**Response:** `{"names": ["Sushi", "Falafel Bowl", ...]}`

---

### `GET /api/countries/names`
List all countries with id and name, translated.

**Query Parameters:** `locale` (optional)
**Response:** `{"countries": [{"id": 1, "name": "Czechia"}, ...]}`

---

### `GET /api/ingrediences/names`
List all ingredient names, translated.

**Query Parameters:** `locale` (optional)
**Response:** `{"ingrediences": ["Potato", "Tomato", ...]}`

---

### User Endpoints *(auth required)*
All require a valid Better Auth session cookie.

#### `GET /api/user/countries`
Get countries for current user.
**Response:** `{ "countries": ["Czechia", "Italy"] }`

#### `POST /api/user/countries`
Add a country to the user.
**Body:** `{ "country": "Czechia" }` ⬅️ Only exact country names accepted.
**Response:** Returns updated list: `{ "countries": [ ... ] }`.

