"use client"

import { useCallback, useState } from "react"

// While capturing, force the holographic overlay into a nice, visible, centered
// state — otherwise the export is "cold" (the effect only shows on hover/breathe).
const HOLO_FREEZE: Record<string, string> = {
  "--card-opacity": "1",
  "--pointer-from-center": "0.7",
  "--pointer-x": "50%",
  "--pointer-y": "42%",
  "--pointer-from-top": "0.42",
  "--pointer-from-left": "0.5",
  "--background-x": "50%",
  "--background-y": "45%",
}

/**
 * Export a DOM node (the rendered .pet-card) to a downloadable PNG, with the
 * holographic effect frozen visible. html-to-image is imported lazily.
 */
export function useCardExport() {
  const [isExporting, setIsExporting] = useState(false)

  const exportCard = useCallback(
    async (node: HTMLElement | null, fileName: string): Promise<boolean> => {
      if (!node) return false
      setIsExporting(true)

      // Snapshot + apply the holo freeze on the card node itself so the overlay
      // layers inherit a visible opacity during capture.
      const previous: Record<string, string> = {}
      const previousAnimation = node.style.animation
      for (const [key, value] of Object.entries(HOLO_FREEZE)) {
        previous[key] = node.style.getPropertyValue(key)
        node.style.setProperty(key, value)
      }
      // Pause the idle "breathing" so the captured frame is deterministic.
      node.style.animation = "none"

      try {
        const { toPng } = await import("html-to-image")
        // Let the forced styles paint before capturing.
        await new Promise((r) => requestAnimationFrame(() => r(null)))

        const dataUrl = await toPng(node, {
          pixelRatio: 3,
          cacheBust: true,
          skipAutoScale: true,
        })
        const link = document.createElement("a")
        link.download = `${fileName}-card.png`
        link.href = dataUrl
        link.click()
        return true
      } catch (err) {
        console.error("Card export failed", err)
        return false
      } finally {
        // Restore the card to its interactive state.
        for (const [key, value] of Object.entries(previous)) {
          if (value) node.style.setProperty(key, value)
          else node.style.removeProperty(key)
        }
        node.style.animation = previousAnimation
        setIsExporting(false)
      }
    },
    [],
  )

  return { exportCard, isExporting }
}
