import type { CardData, PetCardRecord } from "@/types/card"
import type { Database } from "@/lib/supabase/types"

type CardRow = Database["public"]["Tables"]["cards"]["Row"]
type UserRow = Database["public"]["Tables"]["users"]["Row"]

/** Map a cards row (optionally joined with its owner) to a PetCardRecord. */
export function rowToRecord(
  row: CardRow & { users?: Pick<UserRow, "username" | "avatar_url"> | null },
): PetCardRecord {
  const data = row.card_data as CardData
  return {
    ...data,
    id: row.id,
    slug: row.slug,
    owner: row.users?.username ?? "trainer",
    ownerAvatar: row.users?.avatar_url ?? "🐾",
    isPublic: row.is_public,
    likesCount: row.likes_count,
    createdAt: row.created_at,
  }
}

/** Build a URL-safe slug from a card title. */
export function slugifyTitle(title: string): string {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${base || "card"}-${suffix}`
}

/**
 * Prepare CardData for persistence. Drops inline data-URL images so we never
 * bloat the JSONB column — only hosted (Storage) URLs are kept.
 */
export function sanitizeForPersist(card: CardData): CardData {
  const imageUrl = card.imageUrl?.startsWith("data:") ? null : card.imageUrl
  return { ...card, imageUrl: imageUrl ?? null }
}
