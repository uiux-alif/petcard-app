"use client"

import type { RarityLevel } from "@/types/card"
import { RARITY_LEVELS } from "@/lib/card/constants"
import { cn } from "@/lib/utils"

interface RaritySelectorProps {
  value: RarityLevel
  onChange: (rarity: RarityLevel) => void
}

export function RaritySelector({ value, onChange }: RaritySelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {(Object.entries(RARITY_LEVELS) as [string, (typeof RARITY_LEVELS)[RarityLevel]][]).map(
        ([level, config]) => {
          const rarity = Number(level) as RarityLevel
          const selected = value === rarity
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(rarity)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-md border px-1 py-2 font-mono text-[10px] font-semibold transition-all",
                selected
                  ? "bg-secondary"
                  : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary",
              )}
              style={selected ? { borderColor: config.color, color: config.color } : undefined}
            >
              <span>{config.symbol}</span>
              <span className="text-[8.5px]">{config.label}</span>
            </button>
          )
        },
      )}
    </div>
  )
}
