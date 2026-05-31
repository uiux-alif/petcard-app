import Image from "next/image"
import type { CardData } from "@/types/card"
import { getTypeConfig } from "@/lib/card/utils"
import { CardEnergyDots } from "../CardEnergyDots"
import { CardRarityStars } from "../CardRarityStars"

interface TemplateProps {
  card: CardData
}

/**
 * Polaroid template — instant-photo frame with a handwritten caption strip.
 * Same CardData fields, arranged like a snapshot keepsake.
 */
export function PolaroidTemplate({ card }: TemplateProps) {
  const typeConfig = getTypeConfig(card.type)

  return (
    <div className="pol-inner">
      <div className="pol-frame">
        <div className="pol-photo">
          {card.imageUrl ? (
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              sizes="320px"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          ) : (
            <div className="pol-photo-placeholder">🐾</div>
          )}
          <span className="pol-hp">{card.stats.hp} HP</span>
          <span className="pol-stage">{card.stage}</span>
        </div>

        <div className="pol-caption">
          <span className="pol-name">{card.name || "Pet Name"}</span>
          <span className="pol-species">{card.species || "Species · Breed"}</span>
        </div>
      </div>

      <div className="pol-body">
        <div className="pol-moves">
          {card.moves.map((move, i) => (
            <div className="pol-move" key={i}>
              <CardEnergyDots cost={move.cost} />
              <span className="pol-move-name">{move.name || `Move ${i + 1}`}</span>
              <span className="pol-move-dmg">{move.damage || "—"}</span>
            </div>
          ))}
        </div>

        <div className="pol-footer">
          <span className="pol-type">
            {typeConfig.emoji} {typeConfig.label}
          </span>
          <div className="pol-footer-right">
            <CardRarityStars rarity={card.rarity} />
            <span className="pol-number">{card.cardNumber || "001/100"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
