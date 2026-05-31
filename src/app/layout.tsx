import "./globals.css"
import type { Metadata } from "next"
import {
  JetBrains_Mono,
  DM_Sans,
  Anton,
  Bebas_Neue,
  Baloo_2,
  Outfit,
  Russo_One,
} from "next/font/google"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ToastProvider } from "@/components/providers/toast-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { SiteHeader } from "@/components/layout/site-header"
import { cn } from "@/lib/utils"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-card-sans",
})

// ─── Card display fonts (user-selectable per card) ───
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
})
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
})
const baloo2 = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
})
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})
const russoOne = Russo_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-russo",
})

const cardFontVars = cn(
  anton.variable,
  bebasNeue.variable,
  baloo2.variable,
  outfit.variable,
  russoOne.variable,
)

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "PetCard — Collectible Pet Trading Cards",
    template: "%s · PetCard",
  },
  description:
    "Design beautiful collectible trading-card-style cards for your pets. Choose types, stats, rarity, moves, and export as PNG.",
  openGraph: {
    title: "PetCard — Collectible Pet Trading Cards",
    description: "Design beautiful collectible trading cards for your pets.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PetCard — Collectible Pet Trading Cards",
    description: "Design beautiful collectible trading cards for your pets.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-mono antialiased",
          jetbrainsMono.variable,
          dmSans.variable,
          cardFontVars,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <TooltipProvider>
              <ToastProvider>
                <div className="flex min-h-screen flex-col">
                  <SiteHeader />
                  <div className="flex-1">{children}</div>
                </div>
              </ToastProvider>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
