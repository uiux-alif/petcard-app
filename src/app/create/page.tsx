import { CardEditor } from "@/components/card/editor/CardEditor"
import { fetchCardBySlug } from "@/lib/card/queries"
import { fetchPokemonCardBySlug } from "@/lib/pokeapi/fetch"
import type { CardData } from "@/types/card"

export const dynamic = "force-dynamic"

interface CreatePageProps {
  searchParams: Promise<{ remix?: string }>
}

/** Reduce a community record down to editable CardData (drops id/owner/etc.). */
function toCardData(record: {
  name: string
  species: string
  stage: CardData["stage"]
  type: CardData["type"]
  rarity: CardData["rarity"]
  imageUrl: string | null
  stats: CardData["stats"]
  moves: CardData["moves"]
  flavor: string
  cardNumber: string
  template?: CardData["template"]
  holo?: CardData["holo"]
  holoStrength?: number
  font?: CardData["font"]
}): CardData {
  return {
    name: record.name,
    species: record.species,
    stage: record.stage,
    type: record.type,
    rarity: record.rarity,
    imageUrl: record.imageUrl,
    stats: record.stats,
    moves: record.moves,
    flavor: record.flavor,
    cardNumber: record.cardNumber,
    template: record.template,
    holo: record.holo,
    holoStrength: record.holoStrength,
    font: record.font,
  }
}

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const { remix } = await searchParams

  // "Remix" — seed the editor with an existing card as a brand-new draft.
  if (remix) {
    const source = remix.startsWith("pokedex-")
      ? await fetchPokemonCardBySlug(remix)
      : await fetchCardBySlug(remix)
    if (source) {
      const seed = toCardData(source)
      // Give the remix its own identity so it doesn't masquerade as the original.
      seed.name = `${source.name} (Remix)`
      return <CardEditor initialCard={seed} />
    }
  }

  return <CardEditor />
}
