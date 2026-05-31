import "server-only"
import type { PetCardRecord } from "@/types/card"
import { pokemonToCard, type PokeApiPokemon } from "./map"

const BASE = "https://pokeapi.co/api/v2"

const OWNER_AVATARS = ["🔴", "🟡", "🔵", "🟢", "🟣", "🟠"]

/** Pokémon trainers as fake owners for the community feed. */
const TRAINERS = ["Ash", "Misty", "Brock", "Gary", "May", "Dawn", "Serena", "Cynthia"]

/** Fetch a single Pokémon by id or name (cached for a day). */
export async function fetchPokemon(idOrName: number | string): Promise<PokeApiPokemon | null> {
  try {
    const res = await fetch(`${BASE}/pokemon/${idOrName}`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    return (await res.json()) as PokeApiPokemon
  } catch {
    return null
  }
}

/** Turn a fetched Pokémon into a community PetCardRecord. */
function toRecord(p: PokeApiPokemon): PetCardRecord {
  const card = pokemonToCard(p)
  // Anchor synthetic cards to a fixed point in the past so any real
  // user-published card (current timestamps) always sorts above them in the
  // "newest" view, while still ordering the dex feed by id among themselves.
  const POKE_EPOCH = Date.UTC(2020, 0, 1)
  return {
    ...card,
    id: `poke-${p.id}`,
    slug: `pokedex-${p.name}`,
    owner: TRAINERS[p.id % TRAINERS.length]!,
    ownerAvatar: OWNER_AVATARS[p.id % OWNER_AVATARS.length]!,
    isPublic: true,
    likesCount: (p.stats.reduce((s, x) => s + x.base_stat, 0) % 300) + 12,
    createdAt: new Date(POKE_EPOCH - p.id * 60_000).toISOString(),
  }
}

/**
 * Fetch a range of Pokémon (by national dex id) and map them to community
 * cards. Defaults to the original 151. Parallel + per-request cached.
 */
export async function fetchPokemonCards(offset = 0, limit = 24): Promise<PetCardRecord[]> {
  const ids = Array.from({ length: limit }, (_, i) => offset + i + 1)
  const results = await Promise.all(ids.map((id) => fetchPokemon(id)))
  return results.filter((p): p is PokeApiPokemon => p !== null).map(toRecord)
}

/** Fetch one Pokémon as a community card by slug (pokedex-<name>). */
export async function fetchPokemonCardBySlug(slug: string): Promise<PetCardRecord | null> {
  const name = slug.replace(/^pokedex-/, "")
  const p = await fetchPokemon(name)
  return p ? toRecord(p) : null
}
