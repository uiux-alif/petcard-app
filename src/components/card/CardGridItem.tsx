"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import type { PetCardRecord } from "@/types/card"
import { PetCard } from "@/components/card/renderer"
import { getRarityConfig } from "@/lib/card/utils"
import { CardActions } from "./CardActions"
import { LikeButton } from "./LikeButton"

interface CardGridItemProps {
  card: PetCardRecord
  /** Community mode — show the owner instead of rarity, and a working like button. */
  showOwner?: boolean
  /** Collection mode — show edit + delete actions (owner only). */
  editable?: boolean
  /** Whether the current user has liked this card (community mode). */
  liked?: boolean
  /** Whether like toggling is wired (Supabase configured). */
  interactiveLikes?: boolean
  /** When set, the card visual links to this href (e.g. detail page). */
  href?: string
}

export function CardGridItem({
  card,
  showOwner = false,
  editable = false,
  liked = false,
  interactiveLikes = false,
  href,
}: CardGridItemProps) {
  const rarity = getRarityConfig(card.rarity)

  const cardVisual = <PetCard card={card} compact tilt interactive={!href} />

  return (
    <div className="flex flex-col items-center gap-3">
      {href ? (
        <Link href={href} className="contents">
          {cardVisual}
        </Link>
      ) : (
        cardVisual
      )}

      <div className="flex w-[220px] items-center justify-between">
        {showOwner ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{card.ownerAvatar}</span>
            <span className="truncate">{card.owner}</span>
          </div>
        ) : (
          <span className="font-mono text-[10px]" style={{ color: rarity.color }}>
            {rarity.symbol} {rarity.label}
          </span>
        )}

        {editable ? (
          <CardActions cardId={card.id} cardName={card.name} />
        ) : interactiveLikes ? (
          <LikeButton cardId={card.id} initialLikes={card.likesCount} initialLiked={liked} />
        ) : (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Heart className="h-3.5 w-3.5" />
            {card.likesCount}
          </div>
        )}
      </div>
    </div>
  )
}
