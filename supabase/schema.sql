-- ============================================================
-- PetCard — Supabase schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor).
-- Mirrors prisma/schema.prisma + adds RLS, an auth trigger, and storage.
-- ============================================================

-- ─── Tables ───────────────────────────────────────────────

create table if not exists public.users (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique not null,
  email       text unique not null,
  avatar_url  text,
  bio         text,
  created_at  timestamptz not null default now()
);

create table if not exists public.cards (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users (id) on delete cascade,
  title         text not null,
  slug          text unique not null,
  card_data     jsonb not null,
  thumbnail_url text,
  is_public     boolean not null default false,
  likes_count   integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists cards_user_id_idx on public.cards (user_id);
create index if not exists cards_is_public_idx on public.cards (is_public);

create table if not exists public.card_likes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users (id) on delete cascade,
  card_id    uuid not null references public.cards (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, card_id)
);

create index if not exists card_likes_card_id_idx on public.card_likes (card_id);

-- ─── updated_at trigger ───────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cards_set_updated_at on public.cards;
create trigger cards_set_updated_at
  before update on public.cards
  for each row execute function public.set_updated_at();

-- ─── New-user trigger: mirror auth.users → public.users ───

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := split_part(coalesce(new.email, 'trainer'), '@', 1);
  final_username := base_username;
  while exists (select 1 from public.users where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.users (id, username, email, avatar_url)
  values (
    new.id,
    final_username,
    coalesce(new.email, new.id::text),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Row Level Security ───────────────────────────────────

alter table public.users enable row level security;
alter table public.cards enable row level security;
alter table public.card_likes enable row level security;

-- users: profiles are publicly readable; you manage only your own row.
drop policy if exists "users_select_all" on public.users;
create policy "users_select_all" on public.users
  for select using (true);

drop policy if exists "users_insert_self" on public.users;
create policy "users_insert_self" on public.users
  for insert with check (auth.uid() = id);

drop policy if exists "users_update_self" on public.users;
create policy "users_update_self" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- cards: public cards readable by anyone; private cards readable by owner.
drop policy if exists "cards_select_public_or_owner" on public.cards;
create policy "cards_select_public_or_owner" on public.cards
  for select using (is_public or auth.uid() = user_id);

drop policy if exists "cards_insert_owner" on public.cards;
create policy "cards_insert_owner" on public.cards
  for insert with check (auth.uid() = user_id);

drop policy if exists "cards_update_owner" on public.cards;
create policy "cards_update_owner" on public.cards
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cards_delete_owner" on public.cards;
create policy "cards_delete_owner" on public.cards
  for delete using (auth.uid() = user_id);

-- card_likes: likes are public; you may only create/remove your own.
drop policy if exists "likes_select_all" on public.card_likes;
create policy "likes_select_all" on public.card_likes
  for select using (true);

drop policy if exists "likes_insert_self" on public.card_likes;
create policy "likes_insert_self" on public.card_likes
  for insert with check (auth.uid() = user_id);

drop policy if exists "likes_delete_self" on public.card_likes;
create policy "likes_delete_self" on public.card_likes
  for delete using (auth.uid() = user_id);

-- ─── Likes counter triggers ───────────────────────────────

create or replace function public.bump_likes_count()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.cards set likes_count = likes_count + 1 where id = new.card_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.cards set likes_count = greatest(likes_count - 1, 0) where id = old.card_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists card_likes_count_ins on public.card_likes;
create trigger card_likes_count_ins
  after insert on public.card_likes
  for each row execute function public.bump_likes_count();

drop trigger if exists card_likes_count_del on public.card_likes;
create trigger card_likes_count_del
  after delete on public.card_likes
  for each row execute function public.bump_likes_count();

-- ─── Storage: card-images bucket ──────────────────────────

insert into storage.buckets (id, name, public)
values ('card-images', 'card-images', true)
on conflict (id) do nothing;

-- Public read; authenticated users manage only files under their own user-id prefix.
drop policy if exists "card_images_public_read" on storage.objects;
create policy "card_images_public_read" on storage.objects
  for select using (bucket_id = 'card-images');

drop policy if exists "card_images_insert_own" on storage.objects;
create policy "card_images_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'card-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "card_images_update_own" on storage.objects;
create policy "card_images_update_own" on storage.objects
  for update using (
    bucket_id = 'card-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "card_images_delete_own" on storage.objects;
create policy "card_images_delete_own" on storage.objects
  for delete using (
    bucket_id = 'card-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─── Content moderation: card_reports ─────────────────────

create table if not exists public.card_reports (
  id          uuid primary key default gen_random_uuid(),
  card_id     uuid not null references public.cards (id) on delete cascade,
  reporter_id uuid not null references public.users (id) on delete cascade,
  reason      text not null,
  status      text not null default 'open',  -- open | reviewed | dismissed
  created_at  timestamptz not null default now(),
  unique (card_id, reporter_id)
);

create index if not exists card_reports_card_id_idx on public.card_reports (card_id);
create index if not exists card_reports_status_idx on public.card_reports (status);

alter table public.card_reports enable row level security;

-- Reporters can file a report for themselves; reads are restricted (no public
-- select policy → only the service role / dashboard can review the queue).
drop policy if exists "reports_insert_self" on public.card_reports;
create policy "reports_insert_self" on public.card_reports
  for insert with check (auth.uid() = reporter_id);

-- ─── GDPR: self-service account deletion ──────────────────
-- Deletes the caller's auth.users row; ON DELETE CASCADE removes their
-- public.users row, cards, likes, and reports. SECURITY DEFINER so it can
-- reach auth.users while still only ever deleting the *calling* user.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
