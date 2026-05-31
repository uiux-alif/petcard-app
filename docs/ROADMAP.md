# PetCard — Roadmap

## Shipped

- **Foundation** — Next.js 16 + React 19 + Tailwind v4 + shadcn/ui on the
  flux-boiler base. Dark-first theme, rainbow branding.
- **Card engine** — pure renderer, 8 types, 5 rarities, PNG export.
- **Templates (×5)** — Classic, Neo, Minimal, Retro, Polaroid (shared fields).
- **Holo effects (×9)** — basic, reverse, regular, rainbow, cosmos, radiant,
  secret, galaxy (+none); pointer-tracked, with adjustable strength, idle
  "breathing", and a `/card-review` comparison page.
- **Editor** — live preview, all pickers, strength slider, "Surprise me"
  randomizer, image upload to Supabase Storage, save/publish.
- **Persistence** — Supabase schema + RLS + triggers + storage bucket; create,
  edit (`/create/[id]`), delete (with confirm), per-user likes (optimistic).
- **Auth** — email/password + Google OAuth, email confirm/resend, route guards,
  `/settings` profile (username, bio, avatar).
- **Discovery** — community feed (user cards + PokéAPI's 151, paginated), public
  profiles (`/u/[username]`), card detail (`/c/[slug]`) with dynamic OG images.
- **Landing** — multi-section marketing page with community showcase + open
  source credits.
- **Ops** — CI (lint/typecheck/build), Vercel config, handoff docs.

## Backlog (prioritized)

### P1 — close the loop
- [ ] **Showcase real cards first.** Landing + community should prefer published
      user cards, falling back to PokéAPI only to fill space.
- [ ] **Likes on PokéAPI cards.** Currently only real DB cards are likeable;
      decide whether to persist likes for synthetic `poke-*` cards or hide the
      control on them.
- [ ] **"Remix this card"** button on card detail → loads it into the editor.
- [ ] **Empty/loading polish** — skeletons for the landing showcase + detail page.

### P2 — engagement
- [ ] Community filters that query the PokéAPI by type/generation.
- [ ] Comments on cards (PRD scope — needs a `comments` table + RLS).
- [ ] Card collections/sets (group cards into named binders).
- [ ] Search across community + profiles.

### P3 — quality & scale
- [ ] **Tests.** No test suite yet — add Vitest (unit: mappers, builder) +
      Playwright (e2e: create → save → appears in collection). See note below.
- [ ] Thumbnail generation on publish (store a rendered PNG, stop relying on
      live render in grids).
- [ ] Rate-limit / cache the PokéAPI calls behind our own route handler.
- [ ] Analytics (page views, cards created, exports).
- [ ] Accessibility audit pass (screen-reader labels on the card scene, focus
      order in the editor).

### Known gaps / tech debt
- **Firefox holo:** the idle "breathing" relies on `@property`; older Firefox
  won't animate it (hover still works). Acceptable for now.
- **Email confirmation** is ON in Supabase by default — new users must confirm
  before sign-in. Toggle off in the dashboard for frictionless demos.
- **OG images** for PokéAPI cards fetch on every request; consider caching.
- The old Nuxt prototype lives in `../_archive/` (parent repo) for reference only.

## Testing note

There is **no automated test suite yet** — this was intentional during rapid
prototyping. Before scaling the team, P3's testing item should be promoted. Start
with pure functions (`lib/card/mappers.ts`, `lib/pokeapi/map.ts`,
`use-card-builder` reducers) since they're side-effect free and high value.
