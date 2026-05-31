import { fetchCommunityCards, fetchLikedCardIds } from "@/lib/card/queries"
import { fetchPokemonCards } from "@/lib/pokeapi/fetch"
import { hasSupabaseEnv } from "@/lib/supabase/env"
import { CommunityView } from "./community-view"

export const dynamic = "force-dynamic"

export default async function CommunityPage() {
  // Seed the community feed with cards generated from the PokéAPI (first 24).
  const pokeCards = await fetchPokemonCards(0, 24)

  if (!hasSupabaseEnv()) {
    return <CommunityView cards={pokeCards} />
  }

  // Real user-published cards come first, then the PokéAPI feed fills it out.
  const userCards = await fetchCommunityCards()
  const likedIds = await fetchLikedCardIds()
  const cards = [...userCards, ...pokeCards]

  return <CommunityView cards={cards} likedIds={[...likedIds]} interactive />
}
