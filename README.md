# PetCard

[![CI](https://github.com/uiux-alif/petcard-app/actions/workflows/ci.yml/badge.svg)](https://github.com/uiux-alif/petcard-app/actions/workflows/ci.yml)

> The Canva for collectible pet cards.

PetCard is a web platform for creating collectible trading-card-style cards for your pets. Upload a photo, pick a type, tune stats and rarity, design moves, and export a high-res holographic card as PNG.

Built on the **flux-boiler** Next.js boilerplate.

---

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **shadcn/ui** (radix-nova style) + **lucide-react** icons
- **Prisma** (PostgreSQL) — `users`, `cards`, `card_likes`
- **html-to-image** — client-side PNG export
- **next-themes** — dark-first theming

---

## Architecture

The guiding principle: **Card Data ≠ Card Image**. Structured card JSON is the source of truth; the rendered image is an export artifact.

```
src/
├── app/                      # Routes (App Router)
│   ├── page.tsx              # Landing
│   ├── create/               # Real-time card editor (+ /create/[id] edit)
│   ├── collection/           # Personal gallery (edit / delete)
│   ├── community/            # Public feed (likes, load-more)
│   ├── c/[slug]/             # Card detail + OG image
│   ├── u/[username]/         # Public profile
│   ├── settings/             # Profile settings
│   ├── auth/callback/        # OAuth / email-link callback
│   └── login/                # Auth (email + Google)
├── components/
│   ├── card/
│   │   ├── renderer/         # ★ PURE card rendering engine (props in, DOM out)
│   │   │   └── templates/    # Classic + Neo layouts (shared fields)
│   │   ├── editor/           # Editor panel + sections (stateful)
│   │   ├── card.css          # Holographic / type / tilt / template styles
│   │   ├── CardGridItem.tsx  # + CardActions, LikeButton, CardFilterToolbar
│   │   └── CardGridSkeleton.tsx
│   ├── layout/site-header.tsx
│   ├── providers/            # toast-provider, auth-provider
│   └── ui/                   # shadcn primitives
├── hooks/                    # use-card-builder, use-tilt-effect, use-card-export, use-image-upload
├── lib/
│   ├── card/                 # constants, utils, queries, actions, mappers
│   ├── supabase/             # client, server, env, types
│   └── prisma.ts             # Prisma client singleton
├── data/seeds.ts             # Deterministic mock cards (fallback)
├── proxy.ts                  # Auth session refresh + route guards
└── types/card.ts             # Card domain types
prisma/
├── schema.prisma
└── seed.ts
supabase/
└── schema.sql                # Tables, RLS, triggers, storage bucket
```

The renderer (`components/card/renderer/`) imports no store, service, or API. It receives `CardData` and renders — making it portable and independently testable.

---

## Getting Started

```bash
npm install
cp .env.example .env.local   # add Supabase URL + anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without Supabase env vars the app
runs in demo mode (seed data, no persistence).

### Supabase

See [`supabase/README.md`](./supabase/README.md). Apply `supabase/schema.sql` once in
the SQL Editor, then sign up at `/login`.

### Database via Prisma (optional)

```bash
npm run db:generate         # generate Prisma client
npm run db:push             # sync schema (needs DATABASE_URL)
npm run db:seed             # load demo cards
```

---

## Card System

- **8 types** — electric, fire, water, grass, psychic, dark, ice, dragon (each with gradient + color theme)
- **5 rarities** — Common, Uncommon, Rare, SR (holo), SAR (super holo)
- **15 templates** — Classic, Neo, Minimal, Retro, Polaroid, Aurora, Midnight, Sticker, Blueprint, Vaporwave, Comic, Kraft, Neon, Royal, Terminal
- **6 fonts** — Classic, Impact, Condensed, Arcade, Rounded, Modern
- **9 holo effects** — pointer-tracked shine + glare, adjustable strength, idle breathing

---

## Documentation

Team docs live in [`docs/`](./docs):

- [`HANDOFF.md`](./docs/HANDOFF.md) — start here; get productive in 15 minutes
- [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — renderer + holo system deep dive
- [`CONTRIBUTING.md`](./docs/CONTRIBUTING.md) — workflow + recipes (add a template/effect)
- [`ROADMAP.md`](./docs/ROADMAP.md) — what's shipped + prioritized backlog
- [`DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — Vercel + Supabase deploy runbook
- [`supabase/README.md`](./supabase/README.md) — apply the database schema

---

## Testing

```bash
npm run test       # unit tests (Vitest) — pure functions: mappers, pokeapi, utils
npm run test:watch # watch mode
npm run test:e2e   # e2e smoke tests (Playwright) — runs against a prod build
```

CI runs lint, typecheck, unit tests, build, and the Playwright smoke suite on
every push/PR to `main`.

---

## Roadmap

See [`docs/ROADMAP.md`](./docs/ROADMAP.md) for full sprint history and the backlog.

### Deploy (Vercel)

1. Push to a Git repo and import into Vercel.
2. Set env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`.
3. Add your deployed domain to Supabase → Auth → URL configuration (redirect: `https://<domain>/auth/callback`).
