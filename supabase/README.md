# Supabase setup

The app is wired to the Supabase project in `.env.local`. You only need to apply
the schema **once**. The publishable key can't run DDL, so use one of the options below.

## Option A — SQL Editor (recommended, no password needed)

1. Open the [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**.
2. Open `supabase/schema.sql`, copy everything, paste it in, and click **Run**.

That creates the `users`, `cards`, `card_likes` tables, RLS policies, the
new-user trigger, the likes counter, and the public `card-images` storage bucket.

## Option B — Prisma (needs the DB password)

1. Supabase → **Project Settings → Database → Connection string (URI)**. Copy it.
2. Add it to `.env.local` as `DATABASE_URL` (replace `[PASSWORD]`).
3. Run:

   ```bash
   npx prisma db execute --file supabase/schema.sql --schema prisma/schema.prisma
   ```

   (RLS policies, triggers, and the storage bucket only exist in `schema.sql`,
   so prefer running that file over `prisma db push`.)

## Verify

After applying, the app's `/collection` and `/community` pages read live data.
Sign up at `/login`, create a card at `/create`, and click **Save Draft** /
**Publish**.

## Auth providers

- **Email/password** works out of the box.
- **Google OAuth**: enable it under Supabase → **Authentication → Providers → Google**,
  and add `https://<your-domain>/auth/callback` (and the local equivalent) as a
  redirect URL.
