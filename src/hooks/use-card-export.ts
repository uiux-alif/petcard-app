"use client"

import { useCallback, useState } from "react"

/**
 * Export a DOM node (the rendered card) to a downloadable PNG.
 * html-to-image is imported lazily so it only loads when an export runs.
 */
export function useCardExport() {
  const [isExporting, setIsExporting] = useState(false)

  const exportCard = useCallback(
    async (node: HTMLElement | null, fileName: string): Promise<boolean> => {
      if (!node) return false
      setIsExporting(true)
      try {
        const { toPng } = await import("html-to-image")
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
        setIsExporting(false)
      }
    },
    [],
  )

  return { exportCard, isExporting }
}
