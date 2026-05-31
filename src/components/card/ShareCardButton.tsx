"use client"

import { useState, type ReactNode } from "react"
import { Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/providers/toast-provider"
import { cn } from "@/lib/utils"

interface ShareCardButtonProps {
  /** Path on this site to share, e.g. "/c/mochi-abc123" or "/s/...". */
  path: string
  /** Title for the share sheet (used by the native share API on mobile). */
  title: string
  /** Optional body text for the share sheet. */
  text?: string
  size?: "sm" | "default" | "lg" | "icon"
  variant?: "default" | "outline" | "ghost" | "secondary"
  className?: string
  children?: ReactNode
}

/**
 * One-click share button. Prefers the native Web Share API (mobile + supported
 * desktops, opens the OS share sheet) and gracefully falls back to copying the
 * link to the clipboard with a toast.
 */
export function ShareCardButton({
  path,
  title,
  text,
  size = "lg",
  variant = "default",
  className,
  children,
}: ShareCardButtonProps) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    if (typeof window === "undefined") return
    const url = `${window.location.origin}${path}`
    const data: ShareData = { url, title, ...(text ? { text } : {}) }

    // Prefer the native sheet where available — much better UX on mobile.
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(data)
        return // Native sheet handled it (success or user cancel).
      } catch (e) {
        // User dismissed — don't fall through, that's not a failure.
        if ((e as Error).name === "AbortError") return
        // Other errors (NotAllowedError, etc.) → fall through to clipboard.
      }
    }

    // Clipboard fallback.
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.show("Link copied! ✓", "success")
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.show("Couldn't copy link — try again", "error")
    }
  }

  return (
    <Button
      onClick={handleShare}
      size={size}
      variant={variant}
      className={cn("font-bold", className)}
      aria-label="Share this card"
    >
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {children ?? (copied ? "Copied!" : "Share this card")}
    </Button>
  )
}
