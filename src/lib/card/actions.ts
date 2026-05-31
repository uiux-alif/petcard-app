"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { slugifyTitle, sanitizeForPersist } from "@/lib/card/mappers"
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
