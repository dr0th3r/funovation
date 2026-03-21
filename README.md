# Funovation

AI-powered cooking app with voice-guided recipes, personalized recommendations, and discount-aware meal planning.

**Stack:** SvelteKit · PostgreSQL · Drizzle ORM · OpenAI · Better Auth · Tailwind CSS

## Local development

```sh
cp .env.example .env   # fill in secrets
pnpm i
docker compose up -d   # starts postgres on port 5432
pnpm db:migrate        # run migrations + seed
pnpm dev               # http://localhost:5173
```

## Production (Docker)

```sh
docker compose up -d --build
```

App runs behind Caddy at `http://localhost:4040`. Migrations run automatically on startup.

**Fresh deploy (wipe data):**
```sh
docker compose down -v && docker compose up -d --build
```

## Environment variables

Copy `.env.example` → `.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `BETTER_AUTH_SECRET` | 32-char random secret (`openssl rand -base64 32`) |
| `ORIGIN` | App origin URL (e.g. `http://localhost:5173`) |
| `OPENAI_API_KEY` | OpenAI API key |
| `POSTGRES_USER/PASSWORD/DB` | Used by docker-compose |

## Commands

```sh
pnpm dev          # dev server
pnpm build        # production build
pnpm preview      # run built app locally (requires DB running)
pnpm check        # type check
pnpm lint / format

pnpm db:migrate   # run migrations + seed
pnpm db:studio    # Drizzle Studio GUI
pnpm auth:schema  # regenerate auth schema from auth.ts
```

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

