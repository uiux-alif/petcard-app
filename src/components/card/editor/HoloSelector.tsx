"use client"

import type { HoloEffectId } from "@/types/card"
import { HOLO_EFFECTS } from "@/lib/card/holo-effects"
import { cn } from "@/lib/utils"

interface HoloSelectorProps {
  value: HoloEffectId
  onChange: (holo: HoloEffectId) => void
}

export function HoloSelector({ value, onChange }: HoloSelectorProps) {
  const active = HOLO_EFFECTS.find((e) => e.id === value) ?? HOLO_EFFECTS[0]

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        {HOLO_EFFECTS.map((fx) => {
          const selected = value === fx.id
          return (
            <button
              key={fx.id}
              type="button"
              onClick={() => onChange(fx.id)}
              className={cn(
                "rounded-md border px-1 py-2 text-center font-mono text-[10px] font-semibold transition-all",
                selected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary",
              )}
            >
              {fx.name}
            </button>
          )
        })}
      </div>
      <p className="text-[10px] leading-relaxed text-muted-foreground">{active.description}</p>
    </div>
  )
}
