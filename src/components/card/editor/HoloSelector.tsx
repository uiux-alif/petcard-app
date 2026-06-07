"use client"

import { useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
import type { CardData, HoloEffectId } from "@/types/card"
import { HOLO_EFFECTS } from "@/lib/card/holo-effects"
import { PetCard } from "@/components/card/renderer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface HoloSelectorProps {
  /** The live card being edited — used to render an accurate effect swatch. */
  card: CardData
  value: HoloEffectId
  onChange: (holo: HoloEffectId) => void
}

// Card frame is 320×448. We scale a real card into a small swatch and crop to
// the top so each foil effect is shown on the actual artwork.
const FRAME_W = 320
const FRAME_H = 448

export function HoloSelector({ card, value, onChange }: HoloSelectorProps) {
  const [open, setOpen] = useState(false)
  const active = HOLO_EFFECTS.find((e) => e.id === value) ?? HOLO_EFFECTS[0]

  function handlePick(effect: HoloEffectId) {
    onChange(effect)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md border border-border bg-secondary/40 p-2 text-left transition-colors hover:bg-secondary"
        >
          <HoloSwatch card={card} effect={value} size={44} />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-semibold text-foreground">{active.name}</p>
            <p className="truncate text-[10px] text-muted-foreground">{active.description}</p>
          </div>
          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
            Change <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose a holographic effect</DialogTitle>
          <DialogDescription>
            Foil overlays shown on your current card. Adjust strength with the slider after picking.
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[60vh] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
          {HOLO_EFFECTS.map((fx) => {
            const selected = value === fx.id
            return (
              <button
                key={fx.id}
                type="button"
                onClick={() => handlePick(fx.id)}
                title={fx.description}
                aria-pressed={selected}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-md border p-1.5 transition-all",
                  selected
                    ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                    : "border-border bg-secondary/40 hover:bg-secondary",
                )}
              >
                <HoloSwatch card={card} effect={fx.id} size={96} />
                <span
                  className={cn(
                    "font-mono text-[10px] font-semibold leading-none",
                    selected ? "text-primary" : "text-foreground",
                  )}
                >
                  {fx.name}
                </span>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** A small, foil-on cropped swatch of the current card with a given effect. */
function HoloSwatch({
  card,
  effect,
  size,
}: {
  card: CardData
  effect: HoloEffectId
  size: number
}) {
  const swatchCard = useMemo<CardData>(() => ({ ...card, holo: effect }), [card, effect])
  const scale = size / FRAME_W

  return (
    <div className="overflow-hidden rounded-[6px]" style={{ width: size, height: size }}>
      <div
        className="pointer-events-none origin-top-left"
        style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
      >
        <PetCard
          card={swatchCard}
          holo={effect}
          forceOpacity={effect === "none" ? 0 : 0.85}
          interactive={false}
          idle={false}
        />
      </div>
    </div>
  )
}
