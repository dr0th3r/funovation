# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A hackathon cooking app built with SvelteKit (frontend + backend), Drizzle ORM, PostgreSQL, and OpenAI. Core features:
- **Login + Onboarding**: email/password auth, optional allergy/diet and preference steps
- **Food recommendations**: AI-suggested meals based on user preferences, returns structured JSON
- **Guided cooking**: real-time voice chatbot (OpenAI Realtime API speech-to-speech) that walks users through cooking steps and adds timers via function calls
- **Secondary**: discount-aware recommendations using kupi API + themealdb

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm check            # Svelte type checking
pnpm lint             # ESLint + Prettier check
pnpm format           # Auto-format

pnpm db:start         # Start PostgreSQL via Docker
pnpm db:push          # Push schema to DB (dev, no migrations)
pnpm db:generate      # Generate migration files
pnpm db:migrate       # Run pending migrations
pnpm db:studio        # Open Drizzle Studio GUI
pnpm auth:schema      # Regenerate src/lib/server/db/auth.schema.ts from better-auth config
```

**First-time setup:**
```bash
pnpm i && docker compose up -d && pnpm db:migrate && pnpm dev
```

**Required env vars** (copy `.env.example` → `.env`):
- `DATABASE_URL` — postgres connection string (default: `postgres://root:mysecretpassword@localhost:5432/local`)
- `BETTER_AUTH_SECRET` — 32-char secret
- `ORIGIN` — app origin (e.g. `http://localhost:5173`)

## Architecture

### Request flow
All requests pass through `src/hooks.server.ts` which validates the session via Better Auth and sets `event.locals.user` / `event.locals.session`. Protected routes check this in their `+page.server.ts` load functions.

### Auth
Configured in `src/lib/server/auth.ts` using Better Auth with Drizzle adapter. The SvelteKit handler is mounted at `/api/auth/[...all]`. Auth tables are auto-generated — edit `auth.ts` then run `pnpm auth:schema` to regenerate `auth.schema.ts` (do not edit that file manually).

### Database
- Schema lives in `src/lib/server/db/schema.ts` (app tables) and `auth.schema.ts` (auth tables, auto-generated)
- DB instance exported from `src/lib/server/db/index.ts`
- Drizzle config reads `DATABASE_URL` from env

### Key conventions
- **Svelte 5 runes** (`$state`, `$derived`, `$effect`) — not legacy reactivity
- **Arrow functions always** — use `const foo = () => {}`, never `function foo() {}`
- **Tabs** for indentation, single quotes, 100 char print width (Prettier enforced)
- Server-only code goes in `src/lib/server/` — never imported from client components
- UI components go in `src/lib/components/ui/` (shadcn-style)
- `cn()` utility in `src/lib/utils.ts` for conditional Tailwind classes

### Adding AI features
- Use OpenAI SDK server-side in `+page.server.ts` actions or dedicated `+server.ts` API routes
- Guided cooking uses OpenAI Realtime API (speech-to-speech) — handle via a dedicated WebSocket/SSE server route
- Food recommendation endpoint should return structured JSON (recipe name, ingredients, steps) for use in the guided cooking prompt
