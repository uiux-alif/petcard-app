"use client"

import { useCallback, useRef, useState, type CSSProperties } from "react"

/** Clamp helper. */
const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max)
const round = (v: number, p = 3) => parseFloat(v.toFixed(p))
/** Re-map a value from one range to another. */
const adjust = (v: number, fromMin: number, fromMax: number, toMin: number, toMax: number) =>
  round(toMin + ((toMax - toMin) * (v - fromMin)) / (fromMax - fromMin))

interface HoloPointerStyle extends CSSProperties {
  "--pointer-x"?: string
  "--pointer-y"?: string
  "--pointer-from-center"?: string
  "--pointer-from-top"?: string
  "--pointer-from-left"?: string
  "--card-opacity"?: string
  "--rotate-x"?: string
  "--rotate-y"?: string
  "--background-x"?: string
  "--background-y"?: string
}

const REST: HoloPointerStyle = {
  "--pointer-x": "50%",
  "--pointer-y": "50%",
  "--pointer-from-center": "0",
  "--pointer-from-top": "0.5",
  "--pointer-from-left": "0.5",
  "--card-opacity": "0",
  "--rotate-x": "0deg",
  "--rotate-y": "0deg",
  "--background-x": "50%",
  "--background-y": "50%",
}

/**
 * Pointer-driven holographic + tilt state.
 * Ports the math from pokemon-cards-css into CSS custom properties that the
 * holo CSS layers consume. Respects reduced-motion by staying at rest.
 */
export function useHoloPointer(enabled = true) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<HoloPointerStyle>(REST)
  const [transition, setTransition] = useState("transform 0.1s ease, box-shadow 0.4s ease")
  const rafId = useRef<number | null>(null)

  const isEnabled = useCallback(() => {
    if (!enabled) return false
    if (typeof window !== "undefined" && window.matchMedia) {
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    }
    return true
  }, [enabled])

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isEnabled() || !ref.current) return
      const el = ref.current
      const rect = el.getBoundingClientRect()
      const absolute = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      const percent = {
        x: clamp((100 / rect.width) * absolute.x),
        y: clamp((100 / rect.height) * absolute.y),
      }
      const center = { x: percent.x - 50, y: percent.y - 50 }
      const fromCenter = clamp(
        Math.sqrt(center.y * center.y + center.x * center.x) / 50,
        0,
        1,
      )

      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        setTransition("transform 0.1s ease, box-shadow 0.4s ease")
        setStyle({
          "--pointer-x": `${percent.x}%`,
          "--pointer-y": `${percent.y}%`,
          "--pointer-from-center": `${round(fromCenter)}`,
          "--pointer-from-top": `${round(percent.y / 100)}`,
          "--pointer-from-left": `${round(percent.x / 100)}`,
          "--card-opacity": "1",
          "--rotate-x": `${round(-(center.x / 3.5))}deg`,
          "--rotate-y": `${round(center.y / 3.5)}deg`,
          "--background-x": `${adjust(percent.x, 0, 100, 37, 63)}%`,
          "--background-y": `${adjust(percent.y, 0, 100, 33, 67)}%`,
        })
      })
    },
    [isEnabled],
  )

  const onPointerLeave = useCallback(() => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    setTransition("transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease")
    setStyle(REST)
  }, [])

  return { ref, style, transition, onPointerMove, onPointerLeave }
}
