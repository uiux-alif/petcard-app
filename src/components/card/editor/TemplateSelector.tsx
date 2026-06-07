"use client"

import { useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
import type { CardData, CardTemplate } from "@/types/card"
import { CARD_TEMPLATES } from "@/lib/card/constants"
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

interface TemplateSelectorProps {
  /** The live card being edited — used to render a true preview per template. */
  card: CardData
  value: CardTemplate
  onChange: (template: CardTemplate) => void
}

// The card frame is 320×448. We render a real card and scale it down so every
// option shows an accurate, live preview.
const FRAME_W = 320
const FRAME_H = 448

export function TemplateSelector({ card, value, onChange }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false)
  const current = CARD_TEMPLATES[value] ?? CARD_TEMPLATES.classic

  function handlePick(template: CardTemplate) {
    onChange(template)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md border border-border bg-secondary/40 p-2 text-left transition-colors hover:bg-secondary"
        >
          <TemplatePreview card={card} template={value} width={44} />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-semibold text-foreground">{current.label}</p>
            <p className="truncate text-[10px] text-muted-foreground">{current.description}</p>
          </div>
          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
            Change <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose a template</DialogTitle>
          <DialogDescription>
            Same card data, {Object.keys(CARD_TEMPLATES).length} different looks. Previews use your
            current card.
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[60vh] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
          {Object.values(CARD_TEMPLATES).map((tpl) => {
            const selected = value === tpl.id
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handlePick(tpl.id)}
                title={tpl.description}
                aria-pressed={selected}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-md border p-1.5 transition-all",
                  selected
                    ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                    : "border-border bg-secondary/40 hover:bg-secondary",
                )}
              >
                <TemplatePreview card={card} template={tpl.id} width={104} />
                <span
                  className={cn(
                    "font-mono text-[10px] font-semibold leading-none",
                    selected ? "text-primary" : "text-foreground",
                  )}
                >
                  {tpl.label}
                </span>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** A true, scaled-down render of the current card in a given template. */
function TemplatePreview({
  card,
  template,
  width,
}: {
  card: CardData
  template: CardTemplate
  width: number
}) {
  // Override only the template; freeze holo so previews stay calm + cheap.
  const previewCard = useMemo<CardData>(
    () => ({ ...card, template, holo: "none" }),
    [card, template],
  )
  const scale = width / FRAME_W
  const height = FRAME_H * scale

  return (
    <div className="overflow-hidden rounded-[8px]" style={{ width, height }}>
      {/* Scale the fixed-size card frame down into the cell. pointer-events-none
          so the inner card never steals the button's click. */}
      <div
        className="pointer-events-none origin-top-left"
        style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
      >
        <PetCard card={previewCard} interactive={false} idle={false} />
      </div>
    </div>
  )
}
