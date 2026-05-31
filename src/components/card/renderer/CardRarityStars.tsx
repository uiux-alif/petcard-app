import type { RarityLevel } from "@/types/card"
import { getRarityConfig } from "@/lib/card/utils"

interface CardRarityStarsProps {
  rarity: RarityLevel
}

export function CardRarityStars({ rarity }: CardRarityStarsProps) {
  const config = getRarityConfig(rarity)
  const glyph = config.symbol.startsWith("◆") ? "◆" : "★"

  return (
    <div className="card-rarity">
      {Array.from({ length: config.stars }).map((_, i) => (
        <span key={i} className="rarity-star lit">
          {glyph}
        </span>
      ))}
    </div>
  )
}
