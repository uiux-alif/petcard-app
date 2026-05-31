import Image from "next/image"
import type { CardData } from "@/types/card"
import { getTypeConfig, getWeakness } from "@/lib/card/utils"
import { CardRarityStars } from "../CardRarityStars"

interface TemplateProps {
  card: CardData
}

/**
 * Minimal template — quiet, typographic layout with generous whitespace.
 * Same CardData fields; emphasis on the name + a single clean photo.
 */
export function MinimalTemplate({ card }: TemplateProps) {
  const typeConfig = getTypeConfig(card.type)

  return (
    <div className="min-inner">
      <div className="min-head">
        <div className="min-head-left">
          <span className="min-type-dot" />
          <span className="min-stage">{card.stage}</span>
        </div>
        <CardRarityStars rarity={card.rarity} />
      </div>

      <div className="min-title">
        <h3 className="min-name">{card.name || "Pet Name"}</h3>
        <p className="min-species">{card.species || "Species · Breed"}</p>
      </div>

      <div className="min-photo">
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
          <div className="min-photo-placeholder">🐾</div>
        )}
      </div>

      <div className="min-stats">
        {(["hp", "atk", "def", "spd"] as const).map((key) => (
          <div className="min-stat" key={key}>
            <span className="min-stat-val">{card.stats[key]}</span>
            <span className="min-stat-label">{key}</span>
          </div>
        ))}
      </div>

      <div className="min-moves">
        {card.moves.map((move, i) => (
          <div className="min-move" key={i}>
            <span className="min-move-name">{move.name || `Move ${i + 1}`}</span>
            <span className="min-move-dmg">{move.damage || "—"}</span>
          </div>
        ))}
      </div>

      <div className="min-footer">
        <span>
          {typeConfig.emoji} {typeConfig.label}
        </span>
        <span>weakness {getWeakness(card.type)}</span>
        <span>{card.cardNumber || "001/100"}</span>
      </div>
    </div>
  )
}
