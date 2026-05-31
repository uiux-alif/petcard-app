# PetCard — Architecture

Deeper technical notes on the parts that aren't obvious from reading the code.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Icons | lucide-react |
| Backend | Supabase (Postgres + Auth + Storage + RLS) |
| ORM / schema | Prisma (schema reference + local migrations/seed) |
| External data | PokéAPI (community feed) |
| Export | html-to-image (client-side PNG) |
| Hosting | Vercel |

## The card rendering engine

Located in `src/components/card/renderer/`. Design rules:

1. **Pure.** `PetCard` takes `CardData` + display flags and renders DOM. It
   imports no store, query, or server action.
2. **Template dispatch.** `renderTemplate(card)` picks one of five layout
   components (`ClassicTemplate`, `NeoTemplate`, `MinimalTemplate`,
   `RetroTemplate`, `PolaroidTemplate`) based on `card.template`. All consume the
   exact same `CardData` fields.
3. **One frame, many skins.** Every template renders inside the same `.pet-card`
   frame (fixed aspect, type gradient, `isolation: isolate`). Layout CSS lives in
   `card.css`, scoped by `[data-template="…"]`.

### Holographic effects (`holo.css`)

Adapted from [pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css)
(MIT). Critical implementation details — read before touching:

- Effects are two stacked overlay layers, `.holo-shine` and `.holo-glare`,
  scoped by `[data-holo="<id>"]`.
- They're driven by **pointer CSS variables** set by `use-holo-pointer.ts`:
  `--pointer-x/y`, `--pointer-from-center`, `--pointer-from-top/left`,
  `--background-x/y`, `--card-opacity`, `--rotate-x/y`.
- **Dark-card gotcha:** the original uses `color-dodge`, which is near-invisible
  on our dark cards. We use `mix-blend-mode: screen` (always lightens) +
  `isolation: isolate` on the frame so the blend is contained. If you add an
  effect and it "doesn't show," this is almost always why.
- **Variable inheritance gotcha:** the dynamic pointer vars must be declared on
  `.card-scene` (the parent) and **must not** be re-declared on `[data-holo]`
  itself — a value set on the element shadows the inherited one and pins opacity
  to 0. (This bug cost us real time; don't reintroduce it.)
- **Idle "breathing":** an `@property --idle-opacity` animates via the
  `holo-breathe` keyframe; final opacity is
  `max(--card-opacity, --idle-opacity) * --holo-strength`. So hover wins, and at
  rest the card breathes to ~50% of its configured strength. Each card gets a
  deterministic negative `animation-delay` so grids breathe out of phase.
- Respects `prefers-reduced-motion` (no tilt, no breathing).

Textures (glitter, cosmos layers, etc.) live in `public/holo/`. They must
`background-repeat: repeat` to tile — `no-repeat` renders one centered tile.

## Editor

- `use-card-builder.ts` owns transient form state and exposes typed setters
  (`setType`, `setRarity`, `setHolo`, `setHoloStrength`, `randomizeStyle`, …).
- `CardEditor.tsx` is shared by `/create` (new) and `/create/[id]` (edit).
- Image upload: instant local data-URL preview; if signed in, also uploads to
  Supabase Storage and swaps to the hosted URL. `sanitizeForPersist` strips any
  `data:` URL before writing to the DB so the JSONB column never bloats.

## Data layer

- `lib/card/queries.ts` — server reads (community, my cards, by slug, by id,
  liked ids, profile). All `server-only`.
- `lib/card/actions.ts` — server actions (`saveCard`, `updateCard`, `deleteCard`,
  `toggleLike`, `updateProfile`, `loadMoreCommunity`).
- `lib/card/mappers.ts` — DB row ↔ `PetCardRecord`, slug helper, persist sanitizer.
- `lib/pokeapi/` — `fetch.ts` (server fetch with 24h revalidate) + `map.ts`
  (PokéAPI Pokémon → `CardData`: type-mapping 18→8, base-stats → rarity, official
  artwork → image, etc.).

## Auth & routing

- `proxy.ts` (Next 16's renamed middleware) refreshes the Supabase session on
  every request and redirects unauthenticated users away from `/collection` and
  `/settings`.
- Auth state on the client via `components/providers/auth-provider.tsx`.
- OAuth/email links resolve at `app/auth/callback/route.ts`.

## Security notes

- The publishable/anon Supabase key is client-safe; all access is RLS-enforced.
- CSP + security headers are configured in `next.config.ts`. If you add a new
  external image host or API, update `img-src` / `connect-src` there.
- Never commit `.env.local`. Service-role keys must never reach the client.
