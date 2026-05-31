import "server-only"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/env"
import { rowToRecord } from "@/lib/card/mappers"
import type { PetCardRecord } from "@/types/card"

const OWNER_SELECT = "*, users ( username, avatar_url )"

export interface PublicProfile {
  username: string
  avatarUrl: string | null
  bio: string | null
  joined: string
  cards: PetCardRecord[]
}

const COMMUNITY_PAGE_SIZE = 24

/** Public community feed, paginated. Returns [] when Supabase isn't configured. */
export async function fetchCommunityCards(page = 0): Promise<PetCardRecord[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await getSupabaseServerClient()
  const from = page * COMMUNITY_PAGE_SIZE
  const to = from + COMMUNITY_PAGE_SIZE - 1
  const { data, error } = await supabase
    .from("cards")
    .select(OWNER_SELECT)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error || !data) return []
  return data.map(rowToRecord)
}

export { COMMUNITY_PAGE_SIZE }

/** Cards owned by the signed-in user. Returns [] when signed out / unconfigured. */
export async function fetchMyCards(): Promise<PetCardRecord[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("cards")
    .select(OWNER_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error || !data) return []
  return data.map(rowToRecord)
}

/** A single card by slug (RLS limits visibility to public or owner). */
export async function fetchCardBySlug(slug: string): Promise<PetCardRecord | null> {
  if (!hasSupabaseEnv()) return null
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from("cards")
    .select(OWNER_SELECT)
    .eq("slug", slug)
    .maybeSingle()

  if (error || !data) return null
  return rowToRecord(data)
}

/** A single card by id, only if owned by the signed-in user (for editing). */
export async function fetchOwnedCardById(id: string): Promise<PetCardRecord | null> {
  if (!hasSupabaseEnv()) return null
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("cards")
    .select(OWNER_SELECT)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error || !data) return null
  return rowToRecord(data)
}

/** Set of card ids the signed-in user has liked (for community like state). */
export async function fetchLikedCardIds(): Promise<Set<string>> {
  if (!hasSupabaseEnv()) return new Set()
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Set()

  const { data, error } = await supabase
    .from("card_likes")
    .select("card_id")
    .eq("user_id", user.id)

  if (error || !data) return new Set()
  return new Set(data.map((r) => r.card_id))
}

/** Public profile + that user's public cards, by username. */
export async function fetchProfile(username: string): Promise<PublicProfile | null> {
  if (!hasSupabaseEnv()) return null
  const supabase = await getSupabaseServerClient()

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, username, avatar_url, bio, created_at")
    .eq("username", username)
    .maybeSingle()

  if (profileError || !profile) return null

  const { data: cards } = await supabase
    .from("cards")
    .select(OWNER_SELECT)
    .eq("is_public", true)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })

  return {
    username: profile.username,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    joined: profile.created_at,
    cards: (cards ?? []).map(rowToRecord),
  }
}

/** Whether the signed-in user has liked a specific card. */
export async function hasLikedCard(cardId: string): Promise<boolean> {
  if (!hasSupabaseEnv()) return false
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from("card_likes")
    .select("id")
    .eq("card_id", cardId)
    .eq("user_id", user.id)
    .maybeSingle()

  return Boolean(data)
}

export interface MyProfile {
  id: string
  username: string
  email: string
  avatarUrl: string | null
  bio: string | null
}

/** The signed-in user's own profile row (for settings). */
export async function fetchMyProfile(): Promise<MyProfile | null> {
  if (!hasSupabaseEnv()) return null
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("users")
    .select("id, username, email, avatar_url, bio")
    .eq("id", user.id)
    .maybeSingle()

  if (error || !data) return null
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    avatarUrl: data.avatar_url,
    bio: data.bio,
  }
}
