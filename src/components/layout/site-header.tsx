"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/providers/auth-provider"
import { CARD_TYPES } from "@/lib/card/constants"
import type { CardType } from "@/types/card"

const NAV_LINKS = [
  { href: "/create", label: "Create" },
  { href: "/collection", label: "Collection" },
  { href: "/community", label: "Community" },
]

const TYPE_EMOJIS = (Object.entries(CARD_TYPES) as [CardType, { emoji: string; label: string }][]).map(
  ([type, cfg]) => ({ type, emoji: cfg.emoji, label: cfg.label }),
)

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, enabled, signOut } = useAuth()

  // Hide the shell header on the standalone auth page.
  if (pathname === "/login") return null

  const email = user?.email ?? ""
  const initial = email ? email[0]!.toUpperCase() : "🐾"

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex items-center justify-between px-5 py-3.5 sm:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-base font-bold tracking-tight">
            <span className="rainbow-text">PetCard</span>
          </Link>
          {/* The 8 Pokémon-style type emojis, lined up next to the logo */}
          <div className="hidden items-center gap-0.5 border-l border-border pl-3 md:flex">
            {TYPE_EMOJIS.map(({ type, emoji, label }) => (
              <span
                key={type}
                title={label}
                className="text-sm leading-none transition-transform hover:-translate-y-0.5"
                aria-hidden
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            )
          })}

          {enabled && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold transition-colors hover:bg-secondary/70">
                  {initial}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                  {email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/collection">My collection</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="ml-2">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
