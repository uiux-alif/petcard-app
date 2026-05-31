"use client"

import type { CardTemplate } from "@/types/card"
import { CARD_TEMPLATES } from "@/lib/card/constants"
import { cn } from "@/lib/utils"

interface TemplateSelectorProps {
  value: CardTemplate
  onChange: (template: CardTemplate) => void
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.values(CARD_TEMPLATES).map((tpl) => {
        const selected = value === tpl.id
        return (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onChange(tpl.id)}
            className={cn(
              "flex flex-col gap-1.5 rounded-md border p-2.5 text-left transition-all",
              selected
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary/50 hover:bg-secondary",
            )}
          >
            <TemplateThumb template={tpl.id} active={selected} />
            <span
              className={cn(
                "font-mono text-[11px] font-semibold",
                selected ? "text-primary" : "text-foreground",
              )}
            >
              {tpl.label}
            </span>
            <span className="text-[9.5px] leading-tight text-muted-foreground">
              {tpl.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** Tiny abstract preview of each template's layout. */
function TemplateThumb({ template, active }: { template: CardTemplate; active: boolean }) {
  const accent = active ? "bg-primary/70" : "bg-muted-foreground/40"
  const block = active ? "bg-primary/20" : "bg-muted-foreground/15"

  if (template === "neo") {
    return (
      <div className="aspect-[0.72] w-full overflow-hidden rounded-sm border border-border/60 bg-background p-1">
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-0.5 px-0.5 pt-0.5">
            <div className={cn("h-1.5 w-3/4 rounded-full", accent)} />
            <div className={cn("h-1 w-1/2 rounded-full", block)} />
          </div>
          <div className={cn("space-y-0.5 rounded-sm p-1", block)}>
            <div className={cn("h-1 w-full rounded-full", accent)} />
            <div className={cn("h-1 w-full rounded-full", accent)} />
          </div>
        </div>
      </div>
    )
  }

  // classic
  return (
    <div className="aspect-[0.72] w-full overflow-hidden rounded-sm border border-border/60 bg-background p-1">
      <div className="flex h-full flex-col gap-0.5">
        <div className={cn("h-1 w-full rounded-full", accent)} />
        <div className={cn("h-2/5 w-full rounded-sm", block)} />
        <div className={cn("h-1 w-full rounded-full", block)} />
        <div className={cn("h-1 w-full rounded-full", accent)} />
        <div className={cn("h-1 w-full rounded-full", accent)} />
      </div>
    </div>
  )
}
