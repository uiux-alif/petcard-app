"use client"

import type { CardData } from "@/types/card"
import type { HoloEffectId } from "@/lib/card/holo-effects"
import { PetCard } from "@/components/card/renderer"

interface HoloCardProps {
  card: CardData
  effect: HoloEffectId
  compact?: boolean
  /** Force overlay opacity (0–1) so the effect is visible without pointer movement. */
  forceOpacity?: number
}

/**
 * Thin wrapper used by the effects review page: renders a tilt-enabled PetCard
 * with a specific holo effect override and optional forced opacity.
 */
export function HoloCard({ card, effect, compact = false, forceOpacity }: HoloCardProps) {
  return (
    <PetCard
      card={card}
      tilt
      compact={compact}
      holo={effect}
      forceOpacity={forceOpacity}
      interactive={false}
    />
  )
}
