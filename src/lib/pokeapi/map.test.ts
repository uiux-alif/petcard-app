import { describe, it, expect } from "vitest"
import { pokemonToCard, type PokeApiPokemon } from "./map"

function makePokemon(overrides: Partial<PokeApiPokemon> = {}): PokeApiPokemon {
  return {
    id: 25,
    name: "pikachu",
    height: 4,
    weight: 60,
    types: [{ slot: 1, type: { name: "electric" } }],
    stats: [
      { base_stat: 35, stat: { name: "hp" } },
      { base_stat: 55, stat: { name: "attack" } },
      { base_stat: 40, stat: { name: "defense" } },
      { base_stat: 50, stat: { name: "special-attack" } },
      { base_stat: 50, stat: { name: "special-defense" } },
      { base_stat: 90, stat: { name: "speed" } },
    ],
    sprites: {
      other: { "official-artwork": { front_default: "https://img/25.png" } },
      front_default: "https://img/25-small.png",
    },
    ...overrides,
  }
}

describe("pokemonToCard", () => {
  it("maps name and image from official artwork", () => {
    const card = pokemonToCard(makePokemon())
    expect(card.name).toBe("Pikachu")
    expect(card.imageUrl).toBe("https://img/25.png")
  })

  it("maps the primary PokeAPI type onto our card types", () => {
    expect(pokemonToCard(makePokemon()).type).toBe("electric")
    expect(
      pokemonToCard(makePokemon({ types: [{ slot: 1, type: { name: "bug" } }] })).type,
    ).toBe("grass") // bug collapses to grass
    expect(
      pokemonToCard(makePokemon({ types: [{ slot: 1, type: { name: "ghost" } }] })).type,
    ).toBe("psychic")
  })

  it("derives rarity from total base stats", () => {
    // Pikachu total = 320 → rarity 2
    expect(pokemonToCard(makePokemon()).rarity).toBe(2)

    const legendary = makePokemon({
      stats: [
        { base_stat: 106, stat: { name: "hp" } },
        { base_stat: 110, stat: { name: "attack" } },
        { base_stat: 90, stat: { name: "defense" } },
        { base_stat: 154, stat: { name: "special-attack" } },
        { base_stat: 90, stat: { name: "special-defense" } },
        { base_stat: 130, stat: { name: "speed" } },
      ],
    })
    expect(pokemonToCard(legendary).rarity).toBe(5) // total 680 → SAR
  })

  it("clamps stats into our scale", () => {
    const card = pokemonToCard(makePokemon())
    expect(card.stats.hp).toBeGreaterThanOrEqual(30)
    expect(card.stats.hp).toBeLessThanOrEqual(250)
    expect(card.stats.atk).toBeLessThanOrEqual(200)
  })

  it("produces exactly two moves", () => {
    const card = pokemonToCard(makePokemon())
    expect(card.moves).toHaveLength(2)
    expect(card.moves[0].cost).toBeGreaterThanOrEqual(1)
  })

  it("is deterministic for template and holo (stable per id)", () => {
    const a = pokemonToCard(makePokemon())
    const b = pokemonToCard(makePokemon())
    expect(a.template).toBe(b.template)
    expect(a.holo).toBe(b.holo)
  })

  it("falls back to front_default when official artwork is missing", () => {
    const card = pokemonToCard(
      makePokemon({ sprites: { front_default: "https://img/small.png" } }),
    )
    expect(card.imageUrl).toBe("https://img/small.png")
  })
})
