"use client"

import { useCallback, useMemo, useState } from "react"
import type {
  CardData,
  CardStats,
  CardMove,
  CardType,
  CardStage,
  RarityLevel,
  CardTemplate,
  HoloEffectId,
  CardFont,
} from "@/types/card"
import { CARD_DEFAULTS } from "@/lib/card/constants"
import { clamp, getExportFileName } from "@/lib/card/utils"

export interface CharCounts {
  name: number
  species: number
  flavor: number
}

/**
 * Manages transient card form state for the editor.
 * Persistence (drafts, loading) lives elsewhere — this is form-only.
 */
export function useCardBuilder(initial?: Partial<CardData>) {
  const [cardData, setCardData] = useState<CardData>(() => ({
    ...CARD_DEFAULTS,
    ...initial,
    stats: { ...CARD_DEFAULTS.stats, ...initial?.stats },
    moves: (initial?.moves ?? CARD_DEFAULTS.moves).map((m) => ({ ...m })) as [CardMove, CardMove],
  }))
  const [isDirty, setIsDirty] = useState(false)

  const charCounts = useMemo<CharCounts>(
    () => ({
      name: cardData.name.length,
      species: cardData.species.length,
      flavor: cardData.flavor.length,
    }),
    [cardData.name, cardData.species, cardData.flavor],
  )

  const updateField = useCallback(
    <K extends keyof CardData>(key: K, value: CardData[K]) => {
      setCardData((prev) => ({ ...prev, [key]: value }))
      setIsDirty(true)
    },
    [],
  )

  const updateStat = useCallback((stat: keyof CardStats, value: number) => {
    setCardData((prev) => ({ ...prev, stats: { ...prev.stats, [stat]: value } }))
    setIsDirty(true)
  }, [])

  const updateMove = useCallback(
    (index: 0 | 1, field: keyof CardMove, value: string | number) => {
      setCardData((prev) => {
        const moves = prev.moves.map((m) => ({ ...m })) as [CardMove, CardMove]
        const move = moves[index]
        if (field === "cost") {
          move.cost = clamp(Number(value) || 1, 1, 4)
        } else if (field === "damage") {
          move.damage = clamp(Number(value) || 0, 0, 300)
        } else {
          move.name = String(value)
        }
        return { ...prev, moves }
      })
      setIsDirty(true)
    },
    [],
  )

  const setType = useCallback((type: CardType) => updateField("type", type), [updateField])
  const setStage = useCallback((stage: CardStage) => updateField("stage", stage), [updateField])
  const setRarity = useCallback((rarity: RarityLevel) => updateField("rarity", rarity), [updateField])
  const setImage = useCallback((url: string | null) => updateField("imageUrl", url), [updateField])
  const setTemplate = useCallback(
    (template: CardTemplate) => updateField("template", template),
    [updateField],
  )
  const setHolo = useCallback(
    (holo: HoloEffectId) => updateField("holo", holo),
    [updateField],
  )
  const setHoloStrength = useCallback(
    (strength: number) => updateField("holoStrength", clamp(strength, 0, 1)),
    [updateField],
  )
  const setFont = useCallback(
    (font: CardFont) => updateField("font", font),
    [updateField],
  )

  const randomizeStyle = useCallback(() => {
    const templates: CardTemplate[] = [
      "classic", "neo", "minimal", "retro", "polaroid",
      "aurora", "midnight", "sticker", "blueprint", "vapor",
      "comic", "kraft", "neon", "royal", "terminal",
    ]
    const holos: HoloEffectId[] = [
      "basic", "reverse", "regular", "rainbow", "cosmos", "radiant", "secret", "galaxy",
    ]
    const fonts: CardFont[] = ["classic", "anton", "bebas", "baloo", "outfit", "russo"]
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!
    setCardData((prev) => ({
      ...prev,
      template: pick(templates),
      holo: pick(holos),
      holoStrength: Math.round((0.5 + Math.random() * 0.5) * 100) / 100,
      font: pick(fonts),
    }))
    setIsDirty(true)
  }, [])

  const reset = useCallback(() => {
    setCardData({
      ...CARD_DEFAULTS,
      ...initial,
      stats: { ...CARD_DEFAULTS.stats, ...initial?.stats },
      moves: (initial?.moves ?? CARD_DEFAULTS.moves).map((m) => ({ ...m })) as [CardMove, CardMove],
    })
    setIsDirty(false)
  }, [initial])

  const exportFileName = useMemo(() => getExportFileName(cardData.name), [cardData.name])

  return {
    cardData,
    charCounts,
    isDirty,
    updateField,
    updateStat,
    updateMove,
    setType,
    setStage,
    setRarity,
    setImage,
    setTemplate,
    setHolo,
    setHoloStrength,
    setFont,
    randomizeStyle,
    reset,
    exportFileName,
    markClean: () => setIsDirty(false),
  }
}
