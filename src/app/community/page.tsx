import { fetchCommunityCards, fetchLikedCardIds } from "@/lib/card/queries"
import { fetchPokemonCards } from "@/lib/pokeapi/fetch"
import { hasSupabaseEnv } from "@/lib/supabase/env"
import { CommunityView } from "./community-view"

export const dynamic = "force-dynamic"

export default async function CommunityPage() {
  // The PokéAPI feed (the original 24) always backs the community so it's never
  // empty — these are anchored to a 2020 timestamp so they sort below any real
  // published card.
  const pokeCards = await fetchPokemonCards(0, 24)

  if (!hasSupabaseEnv()) {
    return <CommunityView cards={pokeCards} />
  }

  // Real user-published cards lead the feed; the PokéAPI cards fill out the rest.
  const [userCards, likedIds] = await Promise.all([fetchCommunityCards(), fetchLikedCardIds()])
  const cards = [...userCards, ...pokeCards]

  return (
    <CommunityView
      cards={cards}
      likedIds={[...likedIds]}
      interactive
      userCardCount={userCards.length}
    />
  )
}
