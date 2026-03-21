# PIPA — Project Documentation

## Overview

A hackathon cooking app built with SvelteKit that helps users discover recipes based on dietary preferences, get AI-powered meal recommendations, and follow along with a real-time voice cooking assistant.

---

## Technologies

### Core Framework

| Technology | Version | Purpose                       |
| ---------- | ------- | ----------------------------- |
| SvelteKit  | ^2.50.2 | Full-stack web framework      |
| Svelte     | ^5.51.0 | UI framework (Svelte 5 runes) |
| TypeScript | ^5.9.3  | Type safety                   |
| Vite       | ^7.3.1  | Build tool & dev server       |

### Backend & Database

| Technology  | Version | Purpose                           |
| ----------- | ------- | --------------------------------- |
| PostgreSQL  | —       | Primary relational database       |
| Drizzle ORM | ^0.45.1 | Type-safe SQL query builder       |
| drizzle-kit | ^0.31.8 | Schema migrations & introspection |
| Better Auth | ~1.4.21 | Email/password authentication     |

### AI & External APIs

| Technology              | Version | Purpose                           |
| ----------------------- | ------- | --------------------------------- |
| OpenAI SDK              | ^6.32.0 | GPT models + Realtime API         |
| gpt-4o-realtime-preview | —       | Voice-to-voice cooking assistant  |
| gpt-4o-mini             | —       | Ingredient normalization matching |

### UI & Styling

| Technology            | Version      | Purpose                           |
| --------------------- | ------------ | --------------------------------- |
| Tailwind CSS          | ^4.1.18      | Utility-first styling             |
| bits-ui               | ^2.16.3      | Headless accessible UI primitives |
| vaul-svelte           | 1.0.0-next.7 | Drawer/dialog primitives          |
| Lucide Svelte         | ^0.577.0     | SVG icon library                  |
| clsx + tailwind-merge | —            | Conditional class utilities       |

### Forms & Validation

| Technology           | Version | Purpose                   |
| -------------------- | ------- | ------------------------- |
| sveltekit-superforms | ^2.30.0 | Server-side form handling |
| Valibot              | ^1.3.1  | Schema validation         |

### Internationalization

| Technology           | Version | Purpose                            |
| -------------------- | ------- | ---------------------------------- |
| @inlang/paraglide-js | ^2.15.1 | Lightweight i18n with tree-shaking |

### Visualization

| Technology | Version | Purpose                              |
| ---------- | ------- | ------------------------------------ |
| d3-geo     | ^3.1.1  | Geographic projections for world map |
| LayerCake  | ^10.0.2 | Svelte charting framework            |

### Fonts

- `@fontsource-variable/dm-sans`
- `@fontsource-variable/figtree`

---

## Architecture

### Request Flow

```
Browser Request
    │
    ▼
hooks.server.ts          ← validates session via Better Auth
    │                       sets event.locals.user / event.locals.session
    ▼
+layout.server.ts / +page.server.ts   ← protected routes check locals.user
    │
    ▼
+page.svelte             ← renders with server-loaded data
```

### Directory Structure

```
src/
├── routes/
│   ├── (app)/                  # Protected app routes
│   │   ├── (home)/             # Home page
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   ├── voice/              # Voice cooking assistant
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   └── recipes/            # Recipe catalog
│   │       ├── +page.svelte
│   │       ├── +page.server.ts
│   │       ├── recommended/
│   │       └── sale/
│   ├── (auth)/                 # Auth routes
│   │   ├── login/
│   │   └── register/
│   ├── (onboarding)/           # Multi-step onboarding
│   │   └── onboarding/
│   │       ├── allergies/      # Step 0
│   │       ├── preferences/    # Step 1
│   │       └── goal/           # Step 2
│   └── api/
│       └── voice/session/      # POST – creates OpenAI Realtime session
│
├── lib/
│   ├── server/                 # Server-only code (never imported client-side)
│   │   ├── auth.ts             # Better Auth config
│   │   ├── db/
│   │   │   ├── index.ts        # Drizzle instance
│   │   │   ├── schema.ts       # App tables
│   │   │   └── auth.schema.ts  # Auth tables (auto-generated, do not edit)
│   │   ├── ai/
│   │   │   └── ingredient-matcher.ts  # GPT-4o-mini ingredient normalization
│   │   └── recipe-filters.ts   # Allergen + diet filtering helpers
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn-style UI components
│   │   ├── WorldMap.svelte     # D3-based world map visualization
│   │   └── RecipeDetailModal.svelte
│   │
│   ├── paraglide/              # i18n runtime + message files
│   └── utils.ts                # cn() and shared utilities
│
├── hooks.server.ts             # Auth middleware + i18n setup
└── app.html
```

### Key Conventions

- **Svelte 5 runes** — `$state`, `$derived`, `$effect` only; no legacy reactivity
- **Arrow functions** — `const foo = () => {}` always; never `function foo() {}`
- **Tabs** for indentation, single quotes, 100-char line width (Prettier-enforced)
- **Server-only code** in `src/lib/server/` — never imported from `.svelte` files
- **`cn()` utility** for conditional Tailwind class merging

---

## Database Schema

### App Tables (`src/lib/server/db/schema.ts`)

**`recipe`**
| Column | Type | Notes |
|---|---|---|
| id | integer PK | Auto-increment |
| slug | text unique | URL-safe identifier |
| name | text | English name |
| category | text | e.g. "Breakfast", "Dinner" |
| cuisine | text | Plain text country name (e.g. "Italy") |
| imageUrl | text | Recipe image |
| ingredients | jsonb | Array of ingredient objects |
| steps | jsonb | Array of step strings (semicolon separates title from body) |
| timeLengthMinutes | integer | Cook time |
| preferences | jsonb | Diet tags (e.g. `["vegan"]`) |
| pricePerPortionCZK | integer | Cost per serving in CZK |
| allergens | jsonb | Array of allergen strings |

**`recipeTranslation`**
| Column | Type | Notes |
|---|---|---|
| recipeId | FK → recipe.id | |
| locale | text PK | Locale code (e.g. "cs", "en") |
| name, category, cuisine | text | Translated fields |
| ingredients, steps | jsonb | Translated arrays |

**`country`** / **`countryTranslation`** — Reference tables for country names and their translations.

**`userProfile`**
| Column | Type | Notes |
|---|---|---|
| id | text PK | Matches `user.id` from auth |
| onboardingStep | integer | 0–3; gates post-login redirect |
| allergies | text[] | Selected allergens |
| dietaryRestrictions | text[] | e.g. `["vegetarian"]` |
| budgetLunchCzk | integer | Max budget per lunch in CZK |
| dislikedFoods | text[] | Normalized ingredient names |
| goals | text[] | `'plan'`, `'learn'`, `'recommendations'` |
| xp | integer | Gamification placeholder |

### Auth Tables (`auth.schema.ts` — auto-generated)

`user`, `session`, `account`, `verification` — managed by Better Auth. Do not edit manually; run `pnpm auth:schema` after changing `auth.ts`.

---

## Implemented Features

### 1. Authentication

- **Email + password** registration and login via Better Auth
- Registration creates a `userProfile` with `onboardingStep: 0` and redirects to onboarding
- Login reads `onboardingStep` to redirect users to the correct onboarding step or home
- Session validated in `hooks.server.ts` via HTTP-only cookies

### 2. Onboarding (3 Steps)

| Step | Route                     | What it collects                                    |
| ---- | ------------------------- | --------------------------------------------------- |
| 0    | `/onboarding/allergies`   | Allergens (checkboxes) + dietary restriction        |
| 1    | `/onboarding/preferences` | Budget (CZK) + disliked foods with AI normalization |
| 2    | `/onboarding/goal`        | User goals: plan / learn / recommendations          |

**Ingredient normalization** (Step 1) uses a multi-layer matching strategy:

1. Exact normalized match (lowercase, diacritics stripped)
2. Levenshtein fuzzy match (≤34% relative distance)
3. GPT-4o-mini fallback for unrecognized inputs

### 3. Recipe Discovery

**Home page** (`/`)

- 4 random **recommended recipes** filtered by user allergies + diet
- 4 **budget recipes** sorted by `pricePerPortionCZK` ascending
- Opens recipe detail in a modal (`RecipeDetailModal.svelte`)
- Links to the voice cooking assistant with the selected recipe ID

**Recipes catalog** (`/recipes`)

- Full list of recipes, filtered by user dietary restrictions
- Alphabetically sorted

**Budget recipes** (`/recipes/sale`)

- Cheapest recipes first, respecting dietary filters

### 4. Dietary Filtering

Implemented in `src/lib/server/recipe-filters.ts` using Drizzle + PostgreSQL operators:

- **Allergen exclusion**: `?|` operator — excludes recipes whose `allergens` overlap the user's `allergies` array
- **Diet matching**: `@>` operator — only shows recipes whose `preferences` contains the user's `dietaryRestrictions`

### 5. Real-Time Voice Cooking Assistant

Route: `/voice?recipeId=<id>`

**Flow:**

1. User opens recipe modal → clicks "Start cooking" → navigated to `/voice`
2. `+page.server.ts` loads the recipe from the database
3. `POST /api/voice/session` creates an OpenAI Realtime ephemeral session
4. Browser connects to OpenAI Realtime API via WebRTC
5. User speaks; AI guides through recipe steps in natural language

**AI Function Tools** (callable by the assistant during conversation):
| Function | Description |
|---|---|
| `set_cooking_timer(text, seconds)` | Sets a reminder after a delay (5–7200 sec) |
| `pause_cooking_timer()` | Pauses the active timer |
| `resume_cooking_timer()` | Resumes a paused timer |
| `stop_cooking_timer()` | Cancels the active timer |
| `next_recipe_step()` | Advances to the next step |
| `previous_recipe_step()` | Goes back a step |
| `cancel_recipe()` | Exits the cooking session |

**System prompt behavior:**

- Safety warnings for hot surfaces, knives, raw meat
- Asks for confirmation before advancing steps
- Natural conversational tone with appropriate pauses

### 6. World Map Visualization

Component: `src/lib/components/WorldMap.svelte`

- Displays a D3-geo world map on the home page
- Highlights countries of the recipes a user has cooked (future: based on `userProfile.countries`)
- Map GeoJSON data imported as a static module (no async fetch)

### 7. Internationalization

- **Framework**: Paraglide-js (tree-shakeable, zero-runtime overhead)
- **Locales**: English (`en`), Czech (`cs`) — messages in `messages/`
- **Detection**: Cookie-based with `Accept-Language` header fallback
- **Usage**: `import * as m from '$lib/paraglide/messages'` → `m.key_name()`
- All voice assistant UI strings are fully translated

---

## API Endpoints

| Method | Route                | Auth     | Description                                     |
| ------ | -------------------- | -------- | ----------------------------------------------- |
| POST   | `/api/voice/session` | Required | Creates ephemeral OpenAI Realtime session token |
| ALL    | `/api/auth/[...all]` | —        | Better Auth handler (login, register, session)  |

---

## Environment Variables

Copy `.env.example` to `.env`:

| Variable             | Required | Description                                    |
| -------------------- | -------- | ---------------------------------------------- |
| `DATABASE_URL`       | Yes      | PostgreSQL connection string                   |
| `BETTER_AUTH_SECRET` | Yes      | 32-character secret for session signing        |
| `ORIGIN`             | Yes      | App origin URL (e.g. `http://localhost:5173`)  |
| `OPENAI_API_KEY`     | Yes      | OpenAI API key for voice + ingredient matching |

---

## Development Commands

```bash
# Start dev server
pnpm dev

# Type checking
pnpm check

# Linting + formatting
pnpm lint
pnpm format

# Database
pnpm db:start        # Start PostgreSQL via Docker
pnpm db:push         # Push schema (dev, no migrations)
pnpm db:generate     # Generate migration files
pnpm db:migrate      # Run migrations + seed recipes
pnpm db:studio       # Open Drizzle Studio GUI

# Auth schema regeneration (after editing src/lib/server/auth.ts)
pnpm auth:schema
```

**First-time setup:**

```bash
pnpm i && docker compose up -d && pnpm db:migrate && pnpm dev
```

---

## Seed Data

Recipe seeding is handled by `scripts/seed-recipes.ts`, run automatically with `pnpm db:migrate`. Recipes are stored with:

- Cuisine as plain text country names (e.g. `"Italy"`, `"Thailand"`)
- Steps as strings with optional semicolon delimiter (`"title; step body"`)
- Ingredients as structured jsonb arrays with allergen + preference tags
