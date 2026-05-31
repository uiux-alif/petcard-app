import type { CardData, CardType, RarityLevel, HoloEffectId, CardTemplate, CardMove } from "@/types/card"
import { clamp } from "@/lib/card/utils"

/** Subset of the PokeAPI /pokemon response we actually consume. */
export interface PokeApiPokemon {
  id: number
  name: string
  height: number
  weight: number
  types: { slot: number; type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  sprites: {
    other?: {
      "official-artwork"?: { front_default: string | null }
      home?: { front_default: string | null }
    }
    front_default: string | null
  }
}

/** Map PokeAPI's 18 types onto our 8 card types. */
const TYPE_MAP: Record<string, CardType> = {
  electric: "electric",
  fire: "fire",
  water: "water",
  grass: "grass",
  bug: "grass",
  poison: "grass",
  psychic: "psychic",
  ghost: "psychic",
  fairy: "psychic",
  dark: "dark",
  normal: "dark",
  fighting: "dark",
  ground: "dark",
  rock: "dark",
  steel: "ice",
  ice: "ice",
  flying: "ice",
  dragon: "dragon",
}

/** Pick a holo effect deterministically from the pokemon id (stable per card). */
const HOLOS: HoloEffectId[] = [
  "basic", "reverse", "regular", "rainbow", "cosmos", "radiant", "secret", "galaxy",
]
const TEMPLATES: CardTemplate[] = ["classic", "neo", "minimal", "retro", "polaroid"]

function pokeType(p: PokeApiPokemon): CardType {
  const primary = p.types.find((t) => t.slot === 1)?.type.name ?? "normal"
  return TYPE_MAP[primary] ?? "dark"
}

function statValue(p: PokeApiPokemon, name: string): number {
  return p.stats.find((s) => s.stat.name === name)?.base_stat ?? 0
}

/** Rarity from total base stats: stronger pokemon → rarer card. */
function pokeRarity(p: PokeApiPokemon): RarityLevel {
  const total = p.stats.reduce((sum, s) => sum + s.base_stat, 0)
  if (total >= 600) return 5
  if (total >= 500) return 4
  if (total >= 400) return 3
  if (total >= 300) return 2
  return 1
}

function titleCase(s: string): string {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function artwork(p: PokeApiPokemon): string | null {
  return (
    p.sprites.other?.["official-artwork"]?.front_default ??
    p.sprites.other?.home?.front_default ??
    p.sprites.front_default ??
    null
  )
}

/** Two moves derived from the pokemon's strongest offensive stats. */
function pokeMoves(p: PokeApiPokemon): [CardMove, CardMove] {
  const atk = statValue(p, "attack")
  const spAtk = statValue(p, "special-attack")
  const spd = statValue(p, "speed")
  return [
    { name: "Quick Strike", damage: clamp(Math.round(spd / 2) * 10, 10, 120), cost: 1 },
    {
      name: spAtk > atk ? "Energy Blast" : "Power Slam",
      damage: clamp(Math.round(Math.max(atk, spAtk) / 2) * 10, 20, 200),
      cost: spAtk > atk ? 3 : 2,
    },
  ]
}

/**
 * Map a PokeAPI Pokémon onto our platform's CardData — we only take the fields
 * our template needs to fill (name, species, type, stats, image, moves).
 */
export function pokemonToCard(p: PokeApiPokemon): CardData {
  const name = titleCase(p.name)
  return {
    name,
    species: `No. ${String(p.id).padStart(3, "0")} · ${titleCase(pokeType(p))} Pokémon`,
    stage: "BASIC",
    type: pokeType(p),
    rarity: pokeRarity(p),
    imageUrl: artwork(p),
    stats: {
      hp: clamp(Math.round(statValue(p, "hp") / 10) * 10, 30, 250),
      atk: clamp(statValue(p, "attack"), 0, 200),
      def: clamp(statValue(p, "defense"), 0, 200),
      spd: clamp(statValue(p, "speed"), 0, 200),
    },
    moves: pokeMoves(p),
    flavor: `Weighs ${(p.weight / 10).toFixed(1)}kg · stands ${(p.height / 10).toFixed(1)}m`,
    cardNumber: `${String(p.id).padStart(3, "0")}/151`,
    template: TEMPLATES[p.id % TEMPLATES.length],
    holo: HOLOS[p.id % HOLOS.length],
    holoStrength: 0.7,
  }
}
