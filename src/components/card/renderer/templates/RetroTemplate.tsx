import Image from "next/image"
import type { CardData } from "@/types/card"
import { getTypeConfig } from "@/lib/card/utils"
import { CardEnergyDots } from "../CardEnergyDots"
import { CardRarityStars } from "../CardRarityStars"

interface TemplateProps {
  card: CardData
}

/**
 * Retro template — chunky arcade frame with bold borders and a pixel vibe.
 * Same CardData fields, styled like an 8-bit collectible.
 */
export function RetroTemplate({ card }: TemplateProps) {
  const typeConfig = getTypeConfig(card.type)

  return (
    <div className="retro-inner">
      <div className="retro-titlebar">
        <span className="retro-name">{card.name || "PET NAME"}</span>
        <span className="retro-hp">{card.stats.hp} HP</span>
      </div>

      <div className="retro-photo">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            sizes="320px"
            style={{ objectFit: "cover", imageRendering: "pixelated" }}
            unoptimized
          />
        ) : (
          <div className="retro-photo-placeholder">🐾</div>
        )}
        <span className="retro-stage-tag">{card.stage}</span>
      </div>

      <div className="retro-subbar">
        <span className="retro-species">{card.species || "SPECIES · BREED"}</span>
        <span className="retro-type">
          {typeConfig.emoji} {typeConfig.label}
        </span>
      </div>

      <div className="retro-moves">
        {card.moves.map((move, i) => (
          <div className="retro-move" key={i}>
            <CardEnergyDots cost={move.cost} />
            <span className="retro-move-name">{move.name || `MOVE ${i + 1}`}</span>
            <span className="retro-move-dmg">{move.damage || "—"}</span>
          </div>
        ))}
      </div>

      <div className="retro-footer">
        {card.flavor && <span className="retro-flavor">{card.flavor}</span>}
        <div className="retro-footer-row">
          <CardRarityStars rarity={card.rarity} />
          <span className="retro-number">{card.cardNumber || "001/100"}</span>
        </div>
      </div>
    </div>
  )
}
