// ─── Enums / Unions ───
export type CardType =
  | "electric" | "fire" | "water" | "grass"
  | "psychic" | "dark" | "ice" | "dragon"

export type CardStage = "BABY" | "BASIC" | "STAGE 1" | "STAGE 2" | "EX"

export type RarityLevel = 1 | 2 | 3 | 4 | 5

// Visual template the card is rendered with. Same fields, different layout.
export type CardTemplate =
  | "classic" | "neo" | "minimal" | "retro" | "polaroid"
  | "aurora" | "midnight" | "sticker" | "blueprint" | "vapor"
  | "comic" | "kraft" | "neon" | "royal" | "terminal"
  | "sakura" | "carbon" | "candy" | "frost" | "ember" | "graffiti"

// Holographic effect overlay (ported from pokemon-cards-css).
export type HoloEffectId =
  | "none"
  | "basic"
  | "reverse"
  | "regular"
  | "rainbow"
  | "cosmos"
  | "radiant"
  | "secret"
  | "galaxy"

// Card display font (user-selectable per card).
export type CardFont = "classic" | "anton" | "bebas" | "baloo" | "outfit" | "russo"

// ─── Data Types ───
export interface CardMove {
  name: string
  damage: number
  cost: number // 1-4
}

export interface CardStats {
  hp: number
  atk: number
  def: number
  spd: number
}

export interface CardData {
  name: string
  species: string
  stage: CardStage
  type: CardType
  rarity: RarityLevel
  imageUrl: string | null
  stats: CardStats
  moves: [CardMove, CardMove]
  flavor: string
  cardNumber: string
  /** Visual template. Optional for backward-compat; defaults to "classic". */
  template?: CardTemplate
  /** Holographic effect. Optional; defaults to rarity-based behavior ("none" base). */
  holo?: HoloEffectId
  /** Holo effect intensity 0–1. Optional; defaults to 0.7. */
  holoStrength?: number
  /** Display font for the card's name/text. Optional; defaults to "classic". */
  font?: CardFont
}

// ─── Config Types (not data) ───
export interface TypeColors {
  primary: string
  text: string
  border: string
  bg: string
  dot: string
  nameGlow: string
  hoverShadow: string
  hoverShadowGlow: string
}

export interface TypeConfig {
  emoji: string
  label: string
  weaknessEmoji: string
  weaknessType: string
  gradient: string
  colors: TypeColors
}

export interface RarityConfig {
  stars: number
  symbol: string
  holoClass: string
  color: string
  label: string
}

// ─── Store / UI Types ───
export type ToastType = "success" | "error" | "info"

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

// ─── Persisted card (with id + owner) ───
/** Persisted card (with id + owner) */
export interface PetCardRecord extends CardData {
  id: string
  slug: string
  owner: string
  ownerAvatar: string
  isPublic: boolean
  likesCount: number
  createdAt: string
}
