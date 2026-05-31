"use client"

import type { CSSProperties } from "react"
import type { CardData, HoloEffectId } from "@/types/card"
import { DEFAULT_TEMPLATE } from "@/lib/card/constants"
import { DEFAULT_HOLO } from "@/lib/card/holo-effects"
import { useHoloPointer } from "@/hooks/use-holo-pointer"
import { renderTemplate } from "./templates"
import { cn } from "@/lib/utils"
import "../card.css"
import "../holo.css"

export interface PetCardProps {
  card: CardData
  /** Enable 3D tilt + pointer-driven holo tracking. */
  tilt?: boolean
  /** Smaller fixed-size variant for grids. */
  compact?: boolean
  /** Override the card's holo effect (e.g. live editor preview). */
  holo?: HoloEffectId
  /** Override holo strength 0–1 (e.g. live editor preview). */
  holoStrength?: number
  /** Force the holo overlay opacity (0–1) regardless of pointer. For previews. */
  forceOpacity?: number
  /** Gently animate the holo at rest (breathing). Default true. */
  idle?: boolean
  /** When false, the card is not focusable (e.g. inside a link). */
  interactive?: boolean
  /** Provide a ref to the inner .pet-card element for export. */
  cardRef?: React.Ref<HTMLDivElement>
}

/**
 * PetCard — the card rendering engine.
 * Owns the scene/tilt + holographic overlay; delegates the inner layout to the
 * card's chosen template. Pure visual component: CardData in, DOM out.
 */
export function PetCard({
  card,
  tilt = false,
  compact = false,
  holo,
  holoStrength,
  forceOpacity,
  idle = true,
  interactive = true,
  cardRef,
}: PetCardProps) {
  const { ref, style: holoVars, transition, onPointerMove, onPointerLeave } = useHoloPointer(tilt)
  const template = card.template ?? DEFAULT_TEMPLATE
  const effect = holo ?? card.holo ?? DEFAULT_HOLO
  const strength = holoStrength ?? card.holoStrength ?? 0.7

  // Breathe at rest only when an effect is active and not force-pinned.
  const idleAnim = idle && effect !== "none" && forceOpacity === undefined

  // Deterministic per-card stagger so a grid of cards breathes organically
  // instead of in lockstep (stable across SSR/CSR — no hydration mismatch).
  const breatheDelay = idleAnim ? -(hashString(card.name + card.cardNumber) % 7000) : 0

  // When forceOpacity is set, lock the overlay opacity so the effect is always
  // visible (used by the review page slider). We also nudge pointer-from-center
  // so effects that scale by it (rainbow/cosmos/reverse) aren't dimmed at rest.
  const opacityOverride =
    forceOpacity !== undefined
      ? ({
        "--card-opacity": String(forceOpacity),
        "--pointer-from-center": "0.6",
      } as CSSProperties)
      : undefined

  const sceneStyle: CSSProperties = {
    "--holo-strength": String(strength),
    ...(tilt ? { ...holoVars, transition, perspective: "1200px" } : (holoVars as CSSProperties)),
    ...opacityOverride,
  } as CSSProperties

  const cardStyle: CSSProperties | undefined = idleAnim
    ? { animationDelay: `${breatheDelay}ms` }
    : undefined

  return (
    <div
      ref={ref}
      className="card-scene"
      style={sceneStyle}
      onPointerMove={tilt ? onPointerMove : undefined}
      onPointerLeave={tilt ? onPointerLeave : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `${card.name || "Pet card"} preview` : undefined}
    >
      <div className="card-wrap" style={tilt ? { transition } : undefined}>
        <div
          ref={cardRef}
          className={cn("pet-card", compact && "compact", idleAnim && "holo-idle")}
          style={cardStyle}
          data-type={card.type}
          data-template={template}
          data-holo={effect}
        >
          {/* Template-specific content */}
          {renderTemplate(card)}

          {/* Holographic overlays (no-op when effect is "none") */}
          <div className="holo-shine" />
          <div className="holo-glare" />
        </div>
      </div>
    </div>
  )
}

/** Small stable string hash → non-negative integer (for deterministic stagger). */
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}
