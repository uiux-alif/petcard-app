import Image from "next/image"
import type { CardData } from "@/types/card"
import { getTypeConfig, getWeakness, getRetreatCost } from "@/lib/card/utils"
import { CardEnergyDots } from "../CardEnergyDots"
import { CardRarityStars } from "../CardRarityStars"

interface TemplateProps {
  card: CardData
}

/**
 * Classic template — framed TCG layout: boxed photo, info bar, stacked moves.
 * Pure presentation; receives CardData only.
 */
export function ClassicTemplate({ card }: TemplateProps) {
  const typeConfig = getTypeConfig(card.type)

  return (
    <div className="card-inner">
      {/* Top row */}
      <div className="card-top">
        <div className="card-stage">{card.stage}</div>
        <div className="card-name-row">
          <div className="card-name">{card.name || "Pet Name"}</div>
        </div>
        <div className="card-hp-row">
          <div className="card-hp-num">{card.stats.hp}</div>
          <div className="card-hp-label">HP</div>
        </div>
      </div>

      {/* Image */}
      <div className="card-img-wrap">
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
          <div className="card-img-placeholder">
            🐾<span>Add pet photo</span>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="card-info-bar">
        <div className="card-species">{card.species || "Species · Breed"}</div>
        <div className="card-type-badge">
          {typeConfig.emoji} {typeConfig.label}
        </div>
      </div>

      {/* Moves */}
      <div className="card-moves">
        {card.moves.map((move, i) => (
          <div className="card-move" key={i}>
            <CardEnergyDots cost={move.cost} />
            <div className="move-info">
              <div className="move-name">{move.name || `Move ${i + 1}`}</div>
            </div>
            <div className="move-damage">{move.damage || "—"}</div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="card-bottom">
        <div>
          <div className="card-flavor">{card.flavor}</div>
          <div className="card-weakness-row">
            <span>weakness: {getWeakness(card.type)}</span>
            <span style={{ marginLeft: 8 }}>retreat: {getRetreatCost()}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <CardRarityStars rarity={card.rarity} />
          <div className="card-number">{card.cardNumber || "001/100"}</div>
        </div>
      </div>
    </div>
  )
}
