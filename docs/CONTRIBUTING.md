# Contributing to PetCard

## Workflow

1. Branch off `main`: `git checkout -b feat/short-description`.
2. Make your change. Keep the renderer pure (no stores/queries in
   `components/card/renderer/`).
3. Run the gate locally — all three must pass:
   ```bash
   npm run lint && npm run typecheck && npm run build
   ```
4. Open a PR into `main`. CI runs the same gate. Keep PRs focused.

## Commit / PR style

- Present-tense, concise titles: `Add Aurora holo effect`, `Fix glitter tiling`.
- PR description: what changed, how you tested, screenshots for visual changes.

## Recipe: add a card **template**

All templates share the same `CardData` fields — only layout differs.

1. Add the id to `CardTemplate` in `src/types/card.ts`.
2. Register it in `CARD_TEMPLATES` in `src/lib/card/constants.ts` (label + blurb).
3. Create `src/components/card/renderer/templates/YourTemplate.tsx` — a pure
   component taking `{ card }`. Use the shared sub-components
   (`CardEnergyDots`, `CardRarityStars`).
4. Add a `case` to `renderTemplate` in `templates/index.tsx`.
5. Add scoped layout CSS in `card.css` under `[data-template="your-id"]`.
6. The editor picker (`TemplateSelector`) and `/card-review` pick it up
   automatically from `CARD_TEMPLATES`.

## Recipe: add a **holo effect**

1. Add the id to `HoloEffectId` in `src/types/card.ts`.
2. Add an entry to `HOLO_EFFECTS` in `src/lib/card/holo-effects.ts` (name + desc).
3. Add the CSS in `holo.css` under `[data-holo="your-id"] .holo-shine` /
   `.holo-glare`. **Use `mix-blend-mode: screen`** (the base layers already do)
   so it shows on dark cards, and tile textures with `background-repeat: repeat`.
4. Drive it from the pointer vars (`--pointer-x`, `--background-x`,
   `--pointer-from-center`, …) for the interactive feel.
5. It appears in the editor `HoloSelector` and `/card-review` automatically.

> Test new effects on `/card-review` — push the **Effect strength** slider up to
> see them without hovering, and check each card **type** (the glow color shifts).

## Gotchas to remember

- Don't re-declare the dynamic holo pointer vars on `[data-holo]` — it shadows
  the inherited value and the effect goes invisible. (See `docs/ARCHITECTURE.md`.)
- New external image host or API → update `img-src` / `connect-src` in
  `next.config.ts` (CSP), and `images.remotePatterns` for next/image.
- Anything written to `card_data` must be JSON-serializable and small — strip
  `data:` URLs (use `sanitizeForPersist`).
