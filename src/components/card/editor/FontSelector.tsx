"use client"

import type { CardFont } from "@/types/card"
import { CARD_FONTS } from "@/lib/card/constants"
import { cn } from "@/lib/utils"

interface FontSelectorProps {
  value: CardFont
  onChange: (font: CardFont) => void
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {Object.values(CARD_FONTS).map((font) => {
        const selected = value === font.id
        return (
          <button
            key={font.id}
            type="button"
            onClick={() => onChange(font.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-md border px-1 py-2 transition-all",
              selected
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary/50 hover:bg-secondary",
            )}
          >
            {/* "Aa" rendered in the actual font so the choice is obvious */}
            <span
              className="text-lg leading-none text-foreground"
              style={{ fontFamily: font.stack }}
            >
              Aa
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold",
                selected ? "text-primary" : "text-foreground",
              )}
            >
              {font.label}
            </span>
            <span className="text-[8px] leading-tight text-muted-foreground">{font.vibe}</span>
          </button>
        )
      })}
    </div>
  )
}
