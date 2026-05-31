import type { CardType, RarityLevel } from "@/types/card"
import { CARD_TYPES, RARITY_LEVELS } from "@/lib/card/constants"

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function getTypeConfig(type: CardType) {
  return CARD_TYPES[type]
}

export function getRarityConfig(rarity: RarityLevel) {
  return RARITY_LEVELS[rarity]
}

export function getWeakness(type: CardType): string {
  const tc = CARD_TYPES[type]
  return `${tc.weaknessEmoji}×2`
}

export function getRetreatCost(): string {
  return "●"
}

export function formatCardNumber(num: string): string {
  return num || "001/100"
}

export function sanitizeMoveCost(cost: number): number {
  return clamp(Math.round(cost), 1, 4)
}

export function sanitizeMoveDamage(damage: number): number {
  return clamp(Math.round(damage), 0, 300)
}

export function getExportFileName(name: string): string {
  return (name || "petcard").replace(/\s+/g, "-").toLowerCase()
}

export function getCardTypeGradient(type: CardType): string {
  return CARD_TYPES[type].gradient
}
