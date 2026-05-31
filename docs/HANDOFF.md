# PetCard — Engineering Handoff

Welcome to PetCard. This doc gets a new engineer productive in ~15 minutes and
explains what exists, how it's wired, and what's safe to change.

> **TL;DR** — Next.js 16 + React 19 app. Users design holographic collectible
> trading cards for their pets, save them to Supabase, and browse a community
> feed seeded from the PokéAPI. The card renderer is a pure, isolated engine.

---

## 1. Run it locally

```bash
npm install
cp .env.example .env.local     # fill in Supabase values (or leave blank for demo mode)
npm run dev                    # http://localhost:3000
```

Without Supabase env vars the app runs in **demo mode**: no auth/persistence, and
the community feed is powered entirely by the PokéAPI. That's enough to work on
~90% of the UI.

### Useful scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint (`src/`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:generate` | Generate Prisma client (auto-runs on install) |
| `npm run db:push` | Push schema to the DB (needs `DATABASE_URL`) |
| `npm run db:seed` | Seed demo cards (needs `DATABASE_URL`) |

**Before every PR:** `npm run lint && npm run typecheck && npm run build` must all pass.
CI runs exactly these.

---

## 2. The one mental model that matters

```
Card Data  ≠  Card Image
```

A card is **structured JSON** (`CardData`). The rendered visual is just an output
of that data. The renderer never fetches, never touches a store — it takes
`CardData` as a prop and draws. This is why the same renderer powers the editor
preview, grids, detail page, and PNG export.

`CardData` lives in [`src/types/card.ts`](../src/types/card.ts). Key fields:
`name, species, type (8 options), rarity (1–5), stats, moves, template (5),
holo (9 effects), holoStrength, imageUrl`.

---

## 3. Architecture map

```
src/
├── app/                         # Routes (App Router)
│   ├── page.tsx                 # Landing (composes components/landing/*)
│   ├── create/                  # Editor — /create and /create/[id] (edit)
│   ├── collection/              # Your saved cards (auth-gated)
│   ├── community/               # Public feed (user cards + PokéAPI)
│   ├── c/[slug]/                # Card detail + dynamic OG image
│   ├── u/[username]/            # Public profile
│   ├── settings/                # Profile settings (auth-gated)
│   ├── card-review/             # Dev tool: all holo effects side by side
│   ├── auth/callback/           # OAuth / email-link handler
│   └── login/                   # Auth (email + Google)
├── components/
│   ├── card/
│   │   ├── renderer/            # ★ PURE card engine — PetCard + templates/
│   │   ├── editor/              # Stateful editor panel + sections
│   │   ├── card.css             # Frame, type theming, template layouts
│   │   ├── holo.css             # Holographic shine/glare effects
│   │   └── *.tsx                # CardGridItem, CardActions, LikeButton, etc.
│   ├── landing/                 # Landing page sections
│   ├── layout/site-header.tsx   # Top nav
│   ├── providers/               # auth-provider, toast-provider
│   └── ui/                      # shadcn/ui primitives
├── hooks/                       # use-card-builder, use-holo-pointer, etc.
├── lib/
│   ├── card/                    # constants, utils, queries, actions, mappers
│   ├── pokeapi/                 # PokéAPI fetch + field mapping
│   ├── supabase/                # client, server, env, types
│   └── prisma.ts                # Prisma singleton
├── data/seeds.ts                # Deterministic fallback cards (demo mode)
├── proxy.ts                     # Auth session refresh + route guards (Next 16)
└── types/card.ts                # Card domain types
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for deeper detail on the renderer and
holo system.

---

## 4. Data flow cheat-sheet

- **Editor**: `useCardBuilder` holds transient form state → `PetCard` renders the
  live preview → server actions (`lib/card/actions.ts`) persist to Supabase.
- **Reads** (collection/community/profile/detail): server components call
  `lib/card/queries.ts` (Supabase) and/or `lib/pokeapi/fetch.ts`.
- **Mutations** (save/update/delete/like/profile): server actions in
  `lib/card/actions.ts`, all RLS-scoped to the signed-in user.
- **Auth**: `proxy.ts` refreshes the session on every request and guards
  `/collection` and `/settings`. Client state via `auth-provider.tsx`.

---

## 5. Backend (Supabase)

- Schema, RLS, triggers and the storage bucket are in
  [`supabase/schema.sql`](../supabase/schema.sql) — see
  [`supabase/README.md`](../supabase/README.md) to apply it.
- Prisma (`prisma/schema.prisma`) is the **canonical schema reference** and is
  used for local migrations/seeding. Runtime uses the Supabase JS client (RLS).
- Tables: `users`, `cards` (card_data JSONB is the source of truth), `card_likes`.

---

## 6. Conventions

- **TypeScript strict.** No `any` without a reason.
- **Server-first.** Default to server components; add `"use client"` only when
  you need state/effects/handlers.
- **shadcn/ui** for primitives — don't hand-roll buttons/inputs/dialogs.
- **The renderer stays pure.** Never import a store, query, or action into
  `components/card/renderer/`. Pass data in as props.
- **Adding a template or holo effect** is intentionally cheap — see
  [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## 7. What's done vs next

See [`ROADMAP.md`](./ROADMAP.md) for the full sprint history and the prioritized
backlog. Quick status: editor, templates, holo effects, auth, persistence,
community (PokéAPI + user cards), profiles, card detail, OG images, and the
landing page are all shipped. Known gaps and next steps are in the roadmap.

---

## 8. Credits

Holo effects adapted from [pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css)
(MIT). Community data from the [PokéAPI](https://pokeapi.co). UI on
[shadcn/ui](https://ui.shadcn.com). Full attributions are on the landing page footer.
