"use client"

import { useState } from "react"
import type { CardData, CardType, CardTemplate } from "@/types/card"
import { CARD_TYPES, CARD_TEMPLATES, CARD_DEFAULTS } from "@/lib/card/constants"
import { HOLO_EFFECTS } from "@/lib/card/holo-effects"
import { HoloCard } from "@/components/card/HoloCard"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const SAMPLE: CardData = {
  ...CARD_DEFAULTS,
  name: "Mochi",
  species: "Golden Retriever",
  stage: "EX",
  rarity: 5,
  flavor: "A very good dog with a shiny coat",
  stats: { hp: 120, atk: 80, def: 60, spd: 90 },
  moves: [
    { name: "Paw Swipe", damage: 30, cost: 1 },
    { name: "Thunder Bark", damage: 90, cost: 3 },
  ],
  template: "classic",
}

export function ReviewGrid() {
  const [type, setType] = useState<CardType>("electric")
  const [template, setTemplate] = useState<CardTemplate>("classic")
  const [opacity, setOpacity] = useState(60) // 0–100; default forces effects visible
  const [followPointer, setFollowPointer] = useState(false)

  const sample: CardData = { ...SAMPLE, type, template }
  // When "follow pointer" is on, let pointer drive opacity (undefined override).
  const forceOpacity = followPointer ? undefined : opacity / 100

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="sticky top-[57px] z-30 space-y-4 rounded-lg border border-border bg-card/80 p-4 backdrop-blur">
        {/* Effect visibility slider */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex min-w-[260px] flex-1 items-center gap-3">
            <Label className="whitespace-nowrap font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Effect strength
            </Label>
            <Slider
              value={[opacity]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => setOpacity(v[0]!)}
              disabled={followPointer}
              className="flex-1"
            />
            <span className="w-10 text-right font-mono text-xs text-foreground">
              {followPointer ? "—" : `${opacity}%`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="follow" checked={followPointer} onCheckedChange={setFollowPointer} />
            <Label htmlFor="follow" className="font-mono text-xs text-muted-foreground">
              Follow pointer
            </Label>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Drag <strong>Effect strength</strong> up to make every overlay fully visible (great for
          comparing), or flip <strong>Follow pointer</strong> to feel them react to your mouse like
          a real card.
        </p>

        {/* Type switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Type:
          </span>
          {(Object.keys(CARD_TYPES) as CardType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "rounded-md border px-2 py-0.5 font-mono text-[10px] transition-colors",
                type === t
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary",
              )}
            >
              {CARD_TYPES[t].emoji} {CARD_TYPES[t].label}
            </button>
          ))}
        </div>

        {/* Template switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Template:
          </span>
          {(Object.keys(CARD_TEMPLATES) as CardTemplate[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTemplate(t)}
              className={cn(
                "rounded-md border px-2 py-0.5 font-mono text-[10px] transition-colors",
                template === t
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary",
              )}
            >
              {CARD_TEMPLATES[t].label}
            </button>
          ))}
        </div>
      </div>

      {/* Effects grid */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {HOLO_EFFECTS.map((fx) => (
          <div key={fx.id} className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-[460px] items-center justify-center">
              <HoloCard card={sample} effect={fx.id} forceOpacity={forceOpacity} />
            </div>
            <div className="max-w-[300px] space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="font-card-sans text-base font-bold">{fx.name}</span>
                <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {fx.id}
                </code>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{fx.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
