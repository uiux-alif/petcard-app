import { describe, it, expect } from "vitest"
import { rowToRecord, slugifyTitle, sanitizeForPersist } from "./mappers"
import { CARD_DEFAULTS } from "./constants"
import type { CardData } from "@/types/card"

const baseCardData: CardData = { ...CARD_DEFAULTS, name: "Mochi" }

function makeRow(overrides = {}) {
  return {
    id: "card-1",
    user_id: "user-1",
    title: "Mochi",
    slug: "mochi-abc123",
    card_data: baseCardData,
    thumbnail_url: null,
    is_public: true,
    likes_count: 7,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
}

describe("rowToRecord", () => {
  it("merges card_data with row metadata", () => {
    const rec = rowToRecord(makeRow({ users: { username: "alif", avatar_url: "🦊" } }))
    expect(rec.id).toBe("card-1")
    expect(rec.slug).toBe("mochi-abc123")
    expect(rec.name).toBe("Mochi")
    expect(rec.owner).toBe("alif")
    expect(rec.ownerAvatar).toBe("🦊")
    expect(rec.isPublic).toBe(true)
    expect(rec.likesCount).toBe(7)
  })

  it("falls back to defaults when owner is missing", () => {
    const rec = rowToRecord(makeRow({ users: null }))
    expect(rec.owner).toBe("trainer")
    expect(rec.ownerAvatar).toBe("🐾")
  })
})

describe("slugifyTitle", () => {
  it("produces a url-safe slug with a suffix", () => {
    const slug = slugifyTitle("Mochi The Good Boy!")
    expect(slug).toMatch(/^mochi-the-good-boy-[a-z0-9]{6}$/)
  })

  it("falls back to 'card' for empty/symbol-only titles", () => {
    expect(slugifyTitle("!!!")).toMatch(/^card-[a-z0-9]{6}$/)
  })

  it("generates unique slugs for the same title", () => {
    expect(slugifyTitle("Mochi")).not.toBe(slugifyTitle("Mochi"))
  })
})

describe("sanitizeForPersist", () => {
  it("strips inline data-URL images", () => {
    const result = sanitizeForPersist({ ...baseCardData, imageUrl: "data:image/png;base64,AAAA" })
    expect(result.imageUrl).toBeNull()
  })

  it("keeps hosted URLs intact", () => {
    const url = "https://example.supabase.co/storage/x.png"
    const result = sanitizeForPersist({ ...baseCardData, imageUrl: url })
    expect(result.imageUrl).toBe(url)
  })

  it("does not mutate the original card", () => {
    const card = { ...baseCardData, imageUrl: "data:image/png;base64,AAAA" }
    sanitizeForPersist(card)
    expect(card.imageUrl).toBe("data:image/png;base64,AAAA")
  })
})
