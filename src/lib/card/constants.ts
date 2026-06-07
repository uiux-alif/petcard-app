import type {
  CardType,
  TypeConfig,
  RarityLevel,
  RarityConfig,
  CardData,
  CardStage,
  CardTemplate,
  CardFont,
} from "@/types/card"

export const CARD_TYPES: Record<CardType, TypeConfig> = {
  electric: {
    emoji: "⚡",
    label: "ELECTRIC",
    weaknessEmoji: "💧",
    weaknessType: "water",
    gradient:
      "linear-gradient(160deg,#1a1400 0%,#2d2100 30%,#3d2f00 60%,#1a1400 100%)",
    colors: {
      primary: "#eab308",
      text: "#fbbf24",
      border: "rgba(234,179,8,0.4)",
      bg: "rgba(234,179,8,0.1)",
      dot: "#eab308",
      nameGlow: "rgba(250,191,36,0.3)",
      hoverShadow: "rgba(250,191,36,0.25)",
      hoverShadowGlow: "rgba(250,191,36,0.12)",
    },
  },
  fire: {
    emoji: "🔥",
    label: "FIRE",
    weaknessEmoji: "💧",
    weaknessType: "water",
    gradient:
      "linear-gradient(160deg,#1a0800 0%,#2d1200 30%,#3d1a00 60%,#1a0800 100%)",
    colors: {
      primary: "#ef4444",
      text: "#f87171",
      border: "rgba(239,68,68,0.4)",
      bg: "rgba(239,68,68,0.1)",
      dot: "#ef4444",
      nameGlow: "rgba(239,68,68,0.3)",
      hoverShadow: "rgba(239,68,68,0.25)",
      hoverShadowGlow: "rgba(239,68,68,0.12)",
    },
  },
  water: {
    emoji: "💧",
    label: "WATER",
    weaknessEmoji: "⚡",
    weaknessType: "electric",
    gradient:
      "linear-gradient(160deg,#001226 0%,#001e3d 30%,#002952 60%,#001226 100%)",
    colors: {
      primary: "#3b82f6",
      text: "#60a5fa",
      border: "rgba(59,130,246,0.4)",
      bg: "rgba(59,130,246,0.1)",
      dot: "#3b82f6",
      nameGlow: "rgba(96,165,250,0.3)",
      hoverShadow: "rgba(96,165,250,0.25)",
      hoverShadowGlow: "rgba(96,165,250,0.12)",
    },
  },
  grass: {
    emoji: "🌿",
    label: "GRASS",
    weaknessEmoji: "🔥",
    weaknessType: "fire",
    gradient:
      "linear-gradient(160deg,#001a08 0%,#002912 30%,#003818 60%,#001a08 100%)",
    colors: {
      primary: "#22c55e",
      text: "#4ade80",
      border: "rgba(34,197,94,0.4)",
      bg: "rgba(34,197,94,0.1)",
      dot: "#22c55e",
      nameGlow: "rgba(74,222,128,0.3)",
      hoverShadow: "rgba(74,222,128,0.25)",
      hoverShadowGlow: "rgba(74,222,128,0.12)",
    },
  },
  psychic: {
    emoji: "🔮",
    label: "PSYCHIC",
    weaknessEmoji: "🌑",
    weaknessType: "dark",
    gradient:
      "linear-gradient(160deg,#1a0026 0%,#2a003d 30%,#380052 60%,#1a0026 100%)",
    colors: {
      primary: "#a855f7",
      text: "#c084fc",
      border: "rgba(168,85,247,0.4)",
      bg: "rgba(168,85,247,0.1)",
      dot: "#a855f7",
      nameGlow: "rgba(192,132,252,0.3)",
      hoverShadow: "rgba(192,132,252,0.25)",
      hoverShadowGlow: "rgba(192,132,252,0.12)",
    },
  },
  dark: {
    emoji: "🌑",
    label: "DARK",
    weaknessEmoji: "🌿",
    weaknessType: "grass",
    gradient:
      "linear-gradient(160deg,#0a0a0a 0%,#141414 30%,#1a1a1a 60%,#0a0a0a 100%)",
    colors: {
      primary: "#6b7280",
      text: "#9ca3af",
      border: "rgba(107,114,128,0.4)",
      bg: "rgba(107,114,128,0.1)",
      dot: "#6b7280",
      nameGlow: "rgba(107,114,128,0.3)",
      hoverShadow: "rgba(107,114,128,0.25)",
      hoverShadowGlow: "rgba(107,114,128,0.12)",
    },
  },
  ice: {
    emoji: "❄️",
    label: "ICE",
    weaknessEmoji: "🔥",
    weaknessType: "fire",
    gradient:
      "linear-gradient(160deg,#001a2e 0%,#002e4a 30%,#003d5c 60%,#001a2e 100%)",
    colors: {
      primary: "#06b6d4",
      text: "#22d3ee",
      border: "rgba(6,182,212,0.4)",
      bg: "rgba(6,182,212,0.1)",
      dot: "#06b6d4",
      nameGlow: "rgba(34,211,238,0.3)",
      hoverShadow: "rgba(34,211,238,0.25)",
      hoverShadowGlow: "rgba(34,211,238,0.12)",
    },
  },
  dragon: {
    emoji: "🐉",
    label: "DRAGON",
    weaknessEmoji: "❄️",
    weaknessType: "ice",
    gradient:
      "linear-gradient(160deg,#0d1a26 0%,#162940 30%,#1e3854 60%,#0d1a26 100%)",
    colors: {
      primary: "#6366f1",
      text: "#818cf8",
      border: "rgba(99,102,241,0.4)",
      bg: "rgba(99,102,241,0.1)",
      dot: "#6366f1",
      nameGlow: "rgba(129,140,248,0.3)",
      hoverShadow: "rgba(129,140,248,0.25)",
      hoverShadowGlow: "rgba(129,140,248,0.12)",
    },
  },
}

export const RARITY_LEVELS: Record<RarityLevel, RarityConfig> = {
  1: { stars: 1, symbol: "◆", holoClass: "", color: "#9ca3af", label: "Common" },
  2: { stars: 2, symbol: "◆◆", holoClass: "", color: "#6ee7b7", label: "Uncommon" },
  3: { stars: 3, symbol: "★", holoClass: "", color: "#fbbf24", label: "Rare" },
  4: { stars: 4, symbol: "★★", holoClass: "holo", color: "#f0abfc", label: "SR" },
  5: { stars: 5, symbol: "★★★", holoClass: "holo-sar", color: "#ff6b9d", label: "SAR" },
}

export const CARD_STAGES: CardStage[] = ["BABY", "BASIC", "STAGE 1", "STAGE 2", "EX"]

export interface TemplateMeta {
  id: CardTemplate
  label: string
  description: string
}

/** Available visual templates. All share the same CardData fields. */
export const CARD_TEMPLATES: Record<CardTemplate, TemplateMeta> = {
  classic: {
    id: "classic",
    label: "Classic",
    description: "Framed TCG look — boxed photo, info bar, stacked moves.",
  },
  neo: {
    id: "neo",
    label: "Neo",
    description: "Full-bleed photo, overlaid title, frosted stat panel.",
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    description: "Clean and typographic — lots of space, quiet details.",
  },
  retro: {
    id: "retro",
    label: "Retro",
    description: "Chunky arcade frame with bold borders and pixel vibe.",
  },
  polaroid: {
    id: "polaroid",
    label: "Polaroid",
    description: "Snapshot photo with a handwritten caption strip.",
  },
  aurora: {
    id: "aurora",
    label: "Aurora",
    description: "Soft gradient glass with a wide hero photo.",
  },
  midnight: {
    id: "midnight",
    label: "Midnight",
    description: "Deep dark slab with a glowing accent rail.",
  },
  sticker: {
    id: "sticker",
    label: "Sticker",
    description: "Die-cut white outline like a vinyl sticker.",
  },
  blueprint: {
    id: "blueprint",
    label: "Blueprint",
    description: "Technical schematic grid with mono labels.",
  },
  vapor: {
    id: "vapor",
    label: "Vaporwave",
    description: "Sunset gradient + grid, 80s retro-future.",
  },
  comic: {
    id: "comic",
    label: "Comic",
    description: "Bold inked panel with halftone energy.",
  },
  kraft: {
    id: "kraft",
    label: "Kraft",
    description: "Warm paper texture, stamped & taped look.",
  },
  neon: {
    id: "neon",
    label: "Neon",
    description: "Dark arcade with electric outline glow.",
  },
  royal: {
    id: "royal",
    label: "Royal",
    description: "Ornate gold-framed premium presentation.",
  },
  terminal: {
    id: "terminal",
    label: "Terminal",
    description: "Green-on-black hacker console readout.",
  },
  sakura: {
    id: "sakura",
    label: "Sakura",
    description: "Soft pink blossom wash with a delicate petal frame.",
  },
  carbon: {
    id: "carbon",
    label: "Carbon",
    description: "Woven carbon-fiber slab with a sharp tech accent.",
  },
  candy: {
    id: "candy",
    label: "Candy",
    description: "Bright bubblegum pop with playful pastel panels.",
  },
  frost: {
    id: "frost",
    label: "Frost",
    description: "Icy frosted glass with a cool cyan shimmer.",
  },
  ember: {
    id: "ember",
    label: "Ember",
    description: "Molten dark slab with a glowing lava accent.",
  },
  graffiti: {
    id: "graffiti",
    label: "Graffiti",
    description: "Street-art concrete wall with bold spray-paint pops.",
  },
}

export const DEFAULT_TEMPLATE: CardTemplate = "classic"

export interface FontMeta {
  id: CardFont
  label: string
  /** CSS font-family stack for this font option. */
  stack: string
  /** A short word describing the vibe, shown in the picker. */
  vibe: string
}

/**
 * Card display fonts. `stack` references the CSS variables registered in
 * app/layout.tsx via next/font. "classic" is the default DM Sans look.
 */
export const CARD_FONTS: Record<CardFont, FontMeta> = {
  classic: {
    id: "classic",
    label: "Classic",
    stack: "var(--font-card-sans), 'DM Sans', sans-serif",
    vibe: "Clean & friendly",
  },
  anton: {
    id: "anton",
    label: "Impact",
    stack: "var(--font-anton), 'Arial Narrow', sans-serif",
    vibe: "Bold TCG headline",
  },
  bebas: {
    id: "bebas",
    label: "Condensed",
    stack: "var(--font-bebas), 'Oswald', sans-serif",
    vibe: "Tall & punchy",
  },
  russo: {
    id: "russo",
    label: "Arcade",
    stack: "var(--font-russo), 'Trebuchet MS', sans-serif",
    vibe: "Chunky & techy",
  },
  baloo: {
    id: "baloo",
    label: "Rounded",
    stack: "var(--font-baloo), 'Comic Sans MS', cursive",
    vibe: "Soft & playful",
  },
  outfit: {
    id: "outfit",
    label: "Modern",
    stack: "var(--font-outfit), system-ui, sans-serif",
    vibe: "Sleek geometric",
  },
}

export const DEFAULT_FONT: CardFont = "classic"
export const CARD_DEFAULTS: CardData = {
  name: "Pet Name",
  species: "Species · Breed",
  stage: "BASIC",
  type: "electric",
  rarity: 1,
  imageUrl: null,
  stats: { hp: 80, atk: 60, def: 40, spd: 50 },
  moves: [
    { name: "Paw Swipe", damage: 20, cost: 1 },
    { name: "Thunder Bark", damage: 60, cost: 2 },
  ],
  flavor: "",
  cardNumber: "001/100",
  template: "classic",
}
