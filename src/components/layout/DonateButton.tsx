import { Coffee } from "lucide-react"
import { cn } from "@/lib/utils"
import { SITE, hasDonateUrl } from "@/lib/site-config"

interface DonateButtonProps {
  /** Visual style: a filled pill (default) or a quiet inline link. */
  variant?: "pill" | "link"
  className?: string
}

/**
 * "Buy me a coffee" donation link. PetCard is free; this is purely optional
 * support for hosting + development. Renders nothing if no donate URL is set.
 */
export function DonateButton({ variant = "pill", className }: DonateButtonProps) {
  if (!hasDonateUrl()) return null

  if (variant === "link") {
    return (
      <a
        href={SITE.donateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("inline-flex items-center gap-1.5 hover:text-foreground", className)}
      >
        <Coffee className="h-4 w-4" /> Buy me a coffee
      </a>
    )
  }

  return (
    <a
      href={SITE.donateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#FFDD00]/40 bg-[#FFDD00]/10 px-4 py-2 text-sm font-semibold text-[#b8860b] transition-colors hover:bg-[#FFDD00]/20 dark:text-[#FFDD00]",
        className,
      )}
    >
      <Coffee className="h-4 w-4" />
      Buy me a coffee
    </a>
  )
}
