import Image from "next/image"
import type { CardData } from "@/types/card"
import { getTypeConfig, getWeakness } from "@/lib/card/utils"
import { CardEnergyDots } from "../CardEnergyDots"
import { CardRarityStars } from "../CardRarityStars"

interface TemplateProps {
  card: CardData
}

/**
 * Neo template — full-bleed photo, overlaid title, frosted stat panel.
 * Same CardData fields as Classic, reorganized into a modern editorial layout.
 */
export function NeoTemplate({ card }: TemplateProps) {
  const typeConfig = getTypeConfig(card.type)

  return (
    <div className="neo-inner">
      {/* Full-bleed photo */}
      <div className="neo-photo">
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
          <div className="neo-photo-placeholder">🐾</div>
        )}
        <div className="neo-scrim" />
      </div>

      {/* Overlaid header */}
      <div className="neo-header">
        <div className="neo-header-top">
          <span className="neo-stage">{card.stage}</span>
          <span className="neo-type-badge">
            {typeConfig.emoji} {typeConfig.label}
          </span>
        </div>
        <div className="neo-title">
          <h3 className="neo-name">{card.name || "Pet Name"}</h3>
          <div className="neo-hp">
            <span className="neo-hp-num">{card.stats.hp}</span>
            <span className="neo-hp-label">HP</span>
          </div>
        </div>
        <p className="neo-species">{card.species || "Species · Breed"}</p>
      </div>

      {/* Frosted content panel */}
      <div className="neo-panel">
        {/* Stat chips */}
        <div className="neo-stats">
          {(["atk", "def", "spd"] as const).map((key) => (
            <div className="neo-stat" key={key}>
              <span className="neo-stat-label">{key}</span>
              <span className="neo-stat-val">{card.stats[key]}</span>
            </div>
          ))}
        </div>

        {/* Moves */}
        <div className="neo-moves">
          {card.moves.map((move, i) => (
            <div className="neo-move" key={i}>
              <CardEnergyDots cost={move.cost} />
              <span className="neo-move-name">{move.name || `Move ${i + 1}`}</span>
              <span className="neo-move-dmg">{move.damage || "—"}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="neo-footer">
          <div className="neo-footer-left">
            {card.flavor && <p className="neo-flavor">{card.flavor}</p>}
            <span className="neo-weakness">weakness: {getWeakness(card.type)}</span>
          </div>
          <div className="neo-footer-right">
            <CardRarityStars rarity={card.rarity} />
            <span className="neo-number">{card.cardNumber || "001/100"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
