# PetCard — Deployment Runbook

Step-by-step to take PetCard from repo to a live, fully-working production app on
Vercel + Supabase. Budget ~30 minutes the first time.

---

## 0. Prerequisites

- A [Vercel](https://vercel.com) account
- A [Supabase](https://supabase.com) project (free tier is fine)
- This repo: https://github.com/uiux-alif/petcard-app

---

## 1. Supabase — database & auth

1. Create a project at supabase.com. Note the project ref (e.g. `abcd1234`).
2. **Apply the schema:** Dashboard → **SQL Editor** → paste the full contents of
   [`supabase/schema.sql`](../supabase/schema.sql) → **Run**. This creates the
   `users`, `cards`, `card_likes` tables, RLS policies, triggers, and the
   `card-images` storage bucket. (Details in [`supabase/README.md`](../supabase/README.md).)
3. **Grab keys:** Dashboard → **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Auth providers** (Dashboard → **Authentication → Providers**):
   - Email is on by default. For frictionless demos, turn **"Confirm email" OFF**.
   - For Google: enable the Google provider and add its client id/secret.
5. **Redirect URLs** (Dashboard → **Authentication → URL Configuration**):
   - Site URL: your production domain, e.g. `https://petcard.vercel.app`
   - Redirect URLs: add `https://<your-domain>/auth/callback` (and
     `http://localhost:3000/auth/callback` for local).

---

## 2. Vercel — deploy

1. Vercel → **Add New → Project** → import `uiux-alif/petcard-app`.
2. Framework preset auto-detects **Next.js** (see `vercel.json`).
3. **Environment variables** (Settings → Environment Variables):

   | Key | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | your project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon/publishable key |
   | `NEXT_PUBLIC_APP_URL` | your production URL (e.g. `https://petcard.vercel.app`) |

4. **Deploy.** First build runs `npm install` (which runs `prisma generate` via
   `postinstall`) then `next build`.

> The app builds and runs **without** Supabase env vars too — it falls back to
> the PokéAPI-only demo feed. But auth, saving, and collections need them.

---

## 3. Smoke-test the live deploy

After the deploy is green, verify in the browser:

- [ ] `/` landing renders with the community showcase rail
- [ ] `/community` shows PokéAPI cards (Bulbasaur, etc.)
- [ ] `/create` editor works; "Export PNG" downloads an image
- [ ] **Sign up** at `/login` → confirm email (if on) → you land on `/collection`
- [ ] In `/create`, **Save Draft** → the card appears in `/collection`
- [ ] **Publish** a card → it appears in `/community` and at `/u/<your-username>`
- [ ] Open a card detail `/c/<slug>` → like it; count updates
- [ ] Edit a saved card via the pencil action → changes persist
- [ ] Delete a card via the trash action → it's removed

> The authenticated half (rows 4–9) is the part that can't be tested in CI — it
> needs a real signed-in user, so run it manually once per environment.

---

## 4. Post-launch checklist

- [ ] Set up a custom domain in Vercel + update `NEXT_PUBLIC_APP_URL` and the
      Supabase redirect URLs to match.
- [ ] Enable Vercel Analytics (optional).
- [ ] Add branch protection on `main` (require CI to pass) in GitHub settings.
- [ ] Confirm the storage bucket `card-images` is public-read (it is, per the
      schema) so uploaded pet photos render.

---

## Rollback

Vercel keeps every deployment. To roll back: Vercel → **Deployments** → pick a
known-good build → **Promote to Production**. No DB rollback is needed unless a
migration changed the schema (none do by default).

---

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Community is empty | PokéAPI unreachable / rate-limited; it'll recover on next fetch |
| "Sign in" does nothing | Email confirmation is on — check inbox, or disable it |
| Uploaded image 404s | `card-images` bucket missing/not public — re-run schema |
| Auth redirect fails | Redirect URL not whitelisted in Supabase URL config |
| Pet photos won't load via next/image | Host not in `images.remotePatterns` (`next.config.ts`) |
