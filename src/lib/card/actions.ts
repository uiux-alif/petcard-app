"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { slugifyTitle, sanitizeForPersist } from "@/lib/card/mappers"
import { rateLimit } from "@/lib/rate-limit"
import type { CardData } from "@/types/card"
import type { Database } from "@/lib/supabase/types"

type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string }

/** Create a new card owned by the signed-in user. */
export async function saveCard(
  card: CardData,
  options: { isPublic?: boolean } = {},
): Promise<ActionResult<{ id: string; slug: string }>> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "You must be signed in to save a card." }

  // Throttle card creation to curb spam (30 / minute per user).
  const limit = rateLimit(`save:${user.id}`, 30, 60_000)
  if (!limit.ok) {
    return { ok: false, error: `Slow down a moment — try again in ${limit.retryAfter}s.` }
  }

  const title = card.name?.trim() || "Untitled"
  const insert: Database["public"]["Tables"]["cards"]["Insert"] = {
    user_id: user.id,
    title,
    slug: slugifyTitle(title),
    card_data: sanitizeForPersist(card),
    is_public: options.isPublic ?? false,
  }

  const { data, error } = await supabase.from("cards").insert(insert).select("id, slug").single()
  if (error || !data) return { ok: false, error: error?.message ?? "Failed to save card." }

  revalidatePath("/collection")
  if (insert.is_public) revalidatePath("/community")
  return { ok: true, data }
}

/** Update an existing card the user owns. */
export async function updateCard(
  id: string,
  card: CardData,
  options: { isPublic?: boolean } = {},
): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient()
  const update: Database["public"]["Tables"]["cards"]["Update"] = {
    title: card.name?.trim() || "Untitled",
    card_data: sanitizeForPersist(card),
  }
  if (typeof options.isPublic === "boolean") update.is_public = options.isPublic

  const { error } = await supabase.from("cards").update(update).eq("id", id)
  if (error) return { ok: false, error: error.message }

  revalidatePath("/collection")
  revalidatePath("/community")
  return { ok: true }
}

/** Delete a card the user owns. */
export async function deleteCard(id: string): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.from("cards").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }

  revalidatePath("/collection")
  revalidatePath("/community")
  return { ok: true }
}

/** Toggle a like on a card for the signed-in user. */
export async function toggleLike(cardId: string): Promise<ActionResult<{ liked: boolean }>> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Sign in to like cards." }

  // Throttle likes to curb toggle-spam (60 / minute per user).
  const limit = rateLimit(`like:${user.id}`, 60, 60_000)
  if (!limit.ok) {
    return { ok: false, error: `Slow down a moment — try again in ${limit.retryAfter}s.` }
  }

  const { data: existing } = await supabase
    .from("card_likes")
    .select("id")
    .eq("card_id", cardId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase.from("card_likes").delete().eq("id", existing.id)
    if (error) return { ok: false, error: error.message }
    revalidatePath("/community")
    return { ok: true, data: { liked: false } }
  }

  const { error } = await supabase
    .from("card_likes")
    .insert({ card_id: cardId, user_id: user.id })
  if (error) return { ok: false, error: error.message }
  revalidatePath("/community")
  return { ok: true, data: { liked: true } }
}

/** Fetch a page of community cards for "load more" — paginates the PokéAPI feed. */
export async function loadMoreCommunity(page: number): Promise<{
  cards: import("@/types/card").PetCardRecord[]
  likedIds: string[]
}> {
  const { fetchPokemonCards } = await import("@/lib/pokeapi/fetch")
  // page 0 is already shown on initial load, so start at the next offset.
  const pageSize = 24
  const cards = await fetchPokemonCards(page * pageSize, pageSize)
  return { cards, likedIds: [] }
}

/** Update the signed-in user's profile (username, bio, avatar). */
export async function updateProfile(input: {
  username?: string
  bio?: string
  avatarUrl?: string
}): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "You must be signed in." }

  const update: Database["public"]["Tables"]["users"]["Update"] = {}
  if (typeof input.username === "string") {
    const username = input.username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "")
    if (username.length < 3) return { ok: false, error: "Username must be at least 3 characters." }
    update.username = username
  }
  if (typeof input.bio === "string") update.bio = input.bio.slice(0, 160)
  if (typeof input.avatarUrl === "string") update.avatar_url = input.avatarUrl

  const { error } = await supabase.from("users").update(update).eq("id", user.id)
  if (error) {
    if (error.code === "23505") return { ok: false, error: "That username is taken." }
    return { ok: false, error: error.message }
  }

  revalidatePath("/settings")
  revalidatePath("/collection")
  return { ok: true }
}

/** Fetch N random PokéAPI cards (for the landing "shuffle" button). */
export async function shuffleShowcaseCards(
  count = 3,
): Promise<import("@/types/card").PetCardRecord[]> {
  const { fetchRandomPokemonCards } = await import("@/lib/pokeapi/fetch")
  return fetchRandomPokemonCards(count)
}

/**
 * Report a public card for moderation review. Anyone signed in can report;
 * a user can only report a given card once (enforced by a unique constraint).
 */
export async function reportCard(
  cardId: string,
  reason: string,
): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Sign in to report a card." }

  // Synthetic PokéAPI cards aren't in our DB and can't be reported.
  if (cardId.startsWith("pokedex-")) {
    return { ok: false, error: "Sample cards can't be reported." }
  }

  const trimmed = reason.trim().slice(0, 500)
  if (trimmed.length < 3) return { ok: false, error: "Please add a short reason." }

  // Throttle reporting (10 / minute per user).
  const limit = rateLimit(`report:${user.id}`, 10, 60_000)
  if (!limit.ok) {
    return { ok: false, error: `Slow down a moment — try again in ${limit.retryAfter}s.` }
  }

  const { error } = await supabase
    .from("card_reports")
    .insert({ card_id: cardId, reporter_id: user.id, reason: trimmed })

  if (error) {
    if (error.code === "23505") return { ok: true } // already reported — treat as success
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/**
 * Permanently delete the signed-in user's account and all their data
 * (cards, likes, profile). Implemented as a SECURITY DEFINER RPC so it can
 * remove the auth.users row too. See supabase/schema.sql → delete_my_account().
 */
export async function deleteAccount(): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "You must be signed in." }

  const { error } = await supabase.rpc("delete_my_account")
  if (error) return { ok: false, error: error.message }

  await supabase.auth.signOut()
  revalidatePath("/")
  return { ok: true }
}
