import type { RarityLevel } from "@/types/card"
import { getRarityConfig } from "@/lib/card/utils"
import { cn } from "@/lib/utils"

interface CardRarityStarsProps {
  rarity: RarityLevel
}

export function CardRarityStars({ rarity }: CardRarityStarsProps) {
  const config = getRarityConfig(rarity)
  const glyph = config.symbol.startsWith("◆") ? "◆" : "★"

  // Flashy treatments for the top tiers.
  const labelClass = cn(
    "rarity-label",
    rarity === 4 && "rarity-label-sr",
    rarity === 5 && "rarity-label-sar",
  )

  return (
    <div className="card-rarity-row">
      <span className={labelClass} style={rarity < 4 ? { color: config.color } : undefined}>
        {config.label}
      </span>
      <div className={cn("card-rarity", rarity === 4 && "rarity-stars-sr", rarity === 5 && "rarity-stars-sar")}>
        {Array.from({ length: config.stars }).map((_, i) => (
          <span key={i} className="rarity-star lit">
            {glyph}
          </span>
        ))}
      </div>
    </div>
  )
}
