"use client"

import { Slider } from "@/components/ui/slider"

interface StatSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

export function StatSlider({ label, value, min, max, step, onChange }: StatSliderProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-8 shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0]!)}
        className="flex-1"
      />
      <span className="w-7 shrink-0 text-right font-mono text-[11px] text-foreground">{value}</span>
    </div>
  )
}
