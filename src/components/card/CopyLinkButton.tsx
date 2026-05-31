"use client"

import { useState, type ReactNode } from "react"
import { Check, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/providers/toast-provider"
import { cn } from "@/lib/utils"

interface CopyLinkButtonProps {
  /** Path on this site to share, e.g. "/c/mochi-abc123". */
  path: string
  size?: "sm" | "default" | "lg" | "icon"
  variant?: "default" | "outline" | "ghost" | "secondary"
  className?: string
  /** Optional content; defaults to an icon + "Copy link". */
  children?: ReactNode
  /** Toast message after a successful copy. */
  successMessage?: string
}

/**
 * One-click "copy this card's link to clipboard" button. Resolves the absolute
 * URL on the client (so it works wherever it's rendered) and falls back to the
 * raw path if window isn't available.
 */
export function CopyLinkButton({
  path,
  size = "sm",
  variant = "outline",
  className,
  children,
  successMessage = "Link copied! ✓",
}: CopyLinkButtonProps) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${path}` : path
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.show(successMessage, "success")
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.show("Couldn't copy link — try again", "error")
    }
  }

  return (
    <Button
      onClick={handleCopy}
      size={size}
      variant={variant}
      className={cn("font-bold", className)}
      aria-label={copied ? "Link copied" : "Copy link"}
    >
      {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
      {children ?? (copied ? "Copied!" : "Copy link")}
    </Button>
  )
}
