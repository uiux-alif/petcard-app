/**
 * Holographic effect catalog.
 * Each effect is a CSS technique ported from github.com/simeydotme/pokemon-cards-css
 * (MIT). Effects are driven by pointer-position CSS variables set on the card root:
 *   --pointer-x / --pointer-y          (glare focal point, %)
 *   --pointer-from-center              (0 at center → 1 at corner)
 *   --pointer-from-left / -from-top    (0–1)
 *   --background-x / --background-y    (parallax background position, %)
 *   --card-opacity                     (0 at rest → 1 while interacting)
 */

import type { HoloEffectId } from "@/types/card"

export type { HoloEffectId }

export interface HoloEffect {
  id: HoloEffectId
  name: string
  description: string
}

export const DEFAULT_HOLO: HoloEffectId = "none"

export const HOLO_EFFECTS: HoloEffect[] = [
  {
    id: "none",
    name: "None",
    description: "No holographic overlay — just the base card and 3D tilt.",
  },
  {
    id: "basic",
    name: "Basic Foil",
    description: "Subtle diagonal foil sheen that follows the pointer. Understated.",
  },
  {
    id: "reverse",
    name: "Reverse Holo",
    description: "Sparkly glitter foil across the whole card with a soft moving glare.",
  },
  {
    id: "regular",
    name: "Regular Holo",
    description: "Classic vertical rainbow pillars with scanlines — the iconic TCG holo.",
  },
  {
    id: "rainbow",
    name: "Rainbow Secret",
    description: "Saturated diagonal rainbow bands plus glitter. Bold and colorful.",
  },
  {
    id: "cosmos",
    name: "Cosmos",
    description: "Galaxy-textured holo with shifting starfield layers behind the rainbow.",
  },
  {
    id: "radiant",
    name: "Radiant",
    description: "Cross-hatched brushed-metal diffraction that pivots with tilt.",
  },
  {
    id: "secret",
    name: "Secret Gold",
    description: "Gold conic shimmer with dense glitter. Premium, metallic feel.",
  },
  {
    id: "galaxy",
    name: "Galaxy Glow",
    description: "Deep radial cosmic glow that brightens toward the pointer.",
  },
]
