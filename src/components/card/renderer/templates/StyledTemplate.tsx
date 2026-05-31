import Image from "next/image"
import type { CardData } from "@/types/card"
import { getTypeConfig, getWeakness } from "@/lib/card/utils"
import { CardEnergyDots } from "../CardEnergyDots"
import { CardRarityStars } from "../CardRarityStars"

interface TemplateProps {
  card: CardData
}

/**
 * A flexible structured layout shared by the "themed" templates (aurora,
 * midnight, sticker, blueprint, vapor, comic, kraft, neon, royal, terminal).
 * The markup is consistent; each template's personality comes entirely from
 * scoped CSS keyed off `[data-template="…"]` in card.css. This keeps a large
 * family of looks maintainable from one component + one stylesheet block.
 */
export function StyledTemplate({ card }: TemplateProps) {
  const typeConfig = getTypeConfig(card.type)

  return (
    <div className="st-inner">
      <div className="st-head">
        <span className="st-stage">{card.stage}</span>
        <h3 className="st-name">{card.name || "Pet Name"}</h3>
        <span className="st-hp">
          <span className="st-hp-num">{card.stats.hp}</span>
          <span className="st-hp-label">HP</span>
        </span>
      </div>

      <div className="st-photo">
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
          <div className="st-photo-placeholder">🐾</div>
        )}
      </div>

      <div className="st-info">
        <span className="st-species">{card.species || "Species · Breed"}</span>
        <span className="st-type">
          {typeConfig.emoji} {typeConfig.label}
        </span>
      </div>

      <div className="st-stats">
        {(["atk", "def", "spd"] as const).map((key) => (
          <div className="st-stat" key={key}>
            <span className="st-stat-label">{key}</span>
            <span className="st-stat-val">{card.stats[key]}</span>
          </div>
        ))}
      </div>

      <div className="st-moves">
        {card.moves.map((move, i) => (
          <div className="st-move" key={i}>
            <CardEnergyDots cost={move.cost} />
            <span className="st-move-name">{move.name || `Move ${i + 1}`}</span>
            <span className="st-move-dmg">{move.damage || "—"}</span>
          </div>
        ))}
      </div>

      <div className="st-footer">
        <div className="st-footer-left">
          {card.flavor && <span className="st-flavor">{card.flavor}</span>}
          <span className="st-weakness">weakness {getWeakness(card.type)}</span>
        </div>
        <div className="st-footer-right">
          <CardRarityStars rarity={card.rarity} />
          <span className="st-number">{card.cardNumber || "001/100"}</span>
        </div>
      </div>
    </div>
  )
}
