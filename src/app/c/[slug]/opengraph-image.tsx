import { ImageResponse } from "next/og"
import { fetchCardBySlug } from "@/lib/card/queries"
import { fetchPokemonCardBySlug } from "@/lib/pokeapi/fetch"
import { getTypeConfig, getRarityConfig } from "@/lib/card/utils"

export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "PetCard"

interface Props {
  params: { slug: string }
}

export default async function OgImage({ params }: Props) {
  const card = params.slug.startsWith("pokedex-")
    ? await fetchPokemonCardBySlug(params.slug)
    : await fetchCardBySlug(params.slug)

  if (!card) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0a",
            color: "#fff",
            fontSize: 64,
          }}
        >
          PetCard
        </div>
      ),
      size,
    )
  }

  const type = getTypeConfig(card.type)
  const rarity = getRarityConfig(card.rarity)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: type.gradient,
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 28, opacity: 0.7, letterSpacing: 2 }}>
            {card.stage} · {type.emoji} {type.label}
          </div>
          <div style={{ fontSize: 28, color: rarity.color }}>
            {rarity.symbol} {rarity.label}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1 }}>{card.name}</div>
          <div style={{ fontSize: 36, opacity: 0.7, marginTop: 16 }}>{card.species}</div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 32 }}>
          <span>HP {card.stats.hp}</span>
          <span>ATK {card.stats.atk}</span>
          <span>DEF {card.stats.def}</span>
          <span>SPD {card.stats.spd}</span>
          <span style={{ marginLeft: "auto", opacity: 0.6 }}>PetCard</span>
        </div>
      </div>
    ),
    size,
  )
}
