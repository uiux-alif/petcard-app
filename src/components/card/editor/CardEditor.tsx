"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, RotateCcw, Loader2, Save, Globe, ZoomIn, ZoomOut, Maximize } from "lucide-react"
import type { CardData } from "@/types/card"
import { useCardBuilder } from "@/hooks/use-card-builder"
import { useCardExport } from "@/hooks/use-card-export"
import { useToast } from "@/components/providers/toast-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { CardEditorPanel } from "@/components/card/editor/CardEditorPanel"
import { PetCard } from "@/components/card/renderer"
import { Button } from "@/components/ui/button"
import { saveCard, updateCard } from "@/lib/card/actions"

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2
const ZOOM_STEP = 0.1

interface CardEditorProps {
  /** When set, the editor is in "edit" mode for this card id. */
  cardId?: string
  /** Initial card data (for editing an existing card). */
  initialCard?: CardData
  /** Initial publish state (for editing). */
  initialPublic?: boolean
}

export function CardEditor({ cardId, initialCard, initialPublic = false }: CardEditorProps) {
  const builder = useCardBuilder(initialCard)
  const { exportCard, isExporting } = useCardExport()
  const toast = useToast()
  const router = useRouter()
  const { enabled, user } = useAuth()
  const cardRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [zoom, setZoom] = useState(1)

  const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * 100) / 100))
  const zoomIn = () => setZoom((z) => clampZoom(z + ZOOM_STEP))
  const zoomOut = () => setZoom((z) => clampZoom(z - ZOOM_STEP))
  const zoomReset = () => setZoom(1)

  // Ctrl/⌘ + wheel (or plain wheel over the preview) zooms the card. We attach a
  // native non-passive listener so we can preventDefault and stop the page from
  // scrolling while zooming.
  useEffect(() => {
    const el = previewRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
      setZoom((z) => clampZoom(z + delta))
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  const isEditing = Boolean(cardId)

  async function handleExport() {
    const ok = await exportCard(cardRef.current, builder.exportFileName)
    toast.show(ok ? "Card exported! 🎉" : "Export failed. Try again.", ok ? "success" : "error")
  }

  function handleReset() {
    builder.reset()
    toast.show("Editor reset", "info")
  }

  async function handleSave(isPublic: boolean) {
    if (enabled && !user) {
      toast.show("Sign in to save your card", "info")
      router.push(`/login?next=${isEditing ? `/create/${cardId}` : "/create"}`)
      return
    }
    if (!enabled) {
      toast.show("Connect Supabase to save cards", "info")
      return
    }

    setSaving(true)
    const result = isEditing
      ? await updateCard(cardId!, builder.cardData, { isPublic })
      : await saveCard(builder.cardData, { isPublic })
    setSaving(false)

    if (result.ok) {
      // Resolve a slug for the share link. New saves return one in result.data;
      // edits keep the existing slug (we passed it via initialCard).
      const newSlug = !isEditing && result.data ? result.data.slug : undefined
      const shareSlug = newSlug ?? null

      const successMessage = isEditing
        ? "Card updated!"
        : isPublic
          ? "Published to community! 🎉"
          : "Card saved to collection!"

      // Offer a one-click "Copy link" right at the dopamine peak — the share
      // moment users actually want. Only when we have a slug to share.
      toast.show(successMessage, "success", {
        durationMs: shareSlug ? 5000 : 2800,
        action: shareSlug
          ? {
            label: "Copy link",
            onClick: async () => {
              const url = `${window.location.origin}/c/${shareSlug}`
              try {
                await navigator.clipboard.writeText(url)
                toast.show("Link copied! ✓", "success")
              } catch {
                toast.show("Couldn't copy link", "error")
              }
            },
          }
          : undefined,
      })

      builder.markClean()
      router.push("/collection")
      router.refresh()
    } else {
      toast.show(result.error, "error")
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-57px)] grid-cols-1 lg:grid-cols-[420px_1fr]">
      {/* Editor panel */}
      <div className="border-border bg-card/40 px-7 py-8 lg:max-h-[calc(100vh-57px)] lg:overflow-y-auto lg:border-r custom-scrollbar">
        {isEditing && (
          <p className="mb-4 inline-flex rounded-md bg-secondary px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            Editing card
          </p>
        )}

        <CardEditorPanel
          card={builder.cardData}
          charCounts={builder.charCounts}
          onField={builder.updateField}
          onStat={builder.updateStat}
          onMove={builder.updateMove}
          onType={builder.setType}
          onStage={builder.setStage}
          onRarity={builder.setRarity}
          onImage={builder.setImage}
          onTemplate={builder.setTemplate}
          onHolo={builder.setHolo}
          onHoloStrength={builder.setHoloStrength}
          onFont={builder.setFont}
          onRandomize={builder.randomizeStyle}
        />

        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => handleSave(isEditing ? initialPublic : false)}
              disabled={saving}
              className="flex-1 font-bold"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isEditing ? "Save Changes" : "Save Draft"}
            </Button>
            <Button onClick={() => handleSave(true)} disabled={saving} className="flex-1 font-bold">
              <Globe className="h-4 w-4" />
              {isEditing ? "Save & Publish" : "Publish"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 font-bold"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export PNG
            </Button>
            <Button variant="outline" onClick={handleReset} title="Reset editor">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="h-6" />
      </div>

      {/* Preview panel */}
      <div
        ref={previewRef}
        className="relative flex items-center justify-center overflow-hidden bg-background p-10"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(74,222,128,0.05) 0%, transparent 70%)",
          }}
        />

        {/* Zoom controls */}
        <div className="absolute right-5 top-5 z-10 flex items-center gap-1 rounded-lg border border-border bg-card/80 p-1 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={zoomOut}
            disabled={zoom <= ZOOM_MIN}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <button
            onClick={zoomReset}
            className="min-w-[44px] rounded px-1 font-mono text-xs text-muted-foreground hover:text-foreground"
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={zoomIn}
            disabled={zoom >= ZOOM_MAX}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={zoomReset}
            title="Fit"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoomed card */}
        <div
          className="transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          <PetCard card={builder.cardData} tilt cardRef={cardRef} />
        </div>

        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-wide text-muted-foreground/60">
          Hover to rotate · Scroll to zoom · Export captures the hologram
        </p>
      </div>
    </div>
  )
}
