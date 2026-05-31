"use client"

import type { CardType } from "@/types/card"
import { CARD_TYPES } from "@/lib/card/constants"
import { cn } from "@/lib/utils"

interface TypeSelectorProps {
  value: CardType
  onChange: (type: CardType) => void
}

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {(Object.entries(CARD_TYPES) as [CardType, (typeof CARD_TYPES)[CardType]][]).map(
        ([type, config]) => {
          const selected = value === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={cn(
                "rounded-md border px-1 py-1.5 text-center font-mono text-[9.5px] font-semibold tracking-wide transition-all",
                selected
                  ? "text-white"
                  : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary",
              )}
              style={
                selected
                  ? {
                    borderColor: config.colors.border,
                    background: config.colors.bg,
                    color: config.colors.text,
                  }
                  : undefined
              }
            >
              {config.emoji} {config.label.charAt(0) + config.label.slice(1).toLowerCase()}
            </button>
          )
        },
      )}
    </div>
  )
}
