import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Heart } from "lucide-react"
import { fetchCardBySlug } from "@/lib/card/queries"
import { fetchPokemonCardBySlug } from "@/lib/pokeapi/fetch"
import { PetCard } from "@/components/card/renderer"
import { getRarityConfig, getTypeConfig } from "@/lib/card/utils"
import { Button } from "@/components/ui/button"
import type { PetCardRecord } from "@/types/card"

export const dynamic = "force-dynamic"

interface SharePageProps {
  params: Promise<{ slug: string }>
}

async function resolveCard(slug: string): Promise<PetCardRecord | null> {
  if (slug.startsWith("pokedex-")) return fetchPokemonCardBySlug(slug)
  return fetchCardBySlug(slug)
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { slug } = await params
  const card = await resolveCard(slug)
  if (!card) return { title: "Card not found — PetCard" }
  return {
    title: `${card.name} · made with PetCard`,
    description: `${card.name} — a collectible ${getTypeConfig(card.type).label} card made on PetCard. Create your own!`,
    openGraph: {
      title: `${card.name} · made with PetCard`,
      description: `Check out ${card.name}, made on PetCard. Create your own collectible pet card.`,
      images: [`/c/${slug}/opengraph-image`],
    },
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const { slug } = await params
  const card = await resolveCard(slug)
  if (!card) notFound()

  const rarity = getRarityConfig(card.rarity)
  const type = getTypeConfig(card.type)

  return (
    <main className="relative flex min-h-[calc(100vh-57px)] flex-col items-center justify-center overflow-hidden px-6 py-12">
      {/* Ambient brand glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 35%, rgba(192,132,252,0.14) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 50% 90%, rgba(74,222,128,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-7 text-center">
        {/* The card, centered — looks best on mobile */}
        <PetCard card={card} tilt />

        {/* Card identity */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold"
              style={{ background: type.colors.bg, color: type.colors.text }}
            >
              {type.emoji} {type.label}
            </span>
            <span className="font-mono text-[11px]" style={{ color: rarity.color }}>
              {rarity.symbol} {rarity.label}
            </span>
          </div>

          <h1 className="font-card-sans text-3xl font-bold tracking-tight">{card.name}</h1>
          <p className="font-mono text-sm text-muted-foreground">{card.species}</p>

          <div className="flex items-center justify-center gap-3 pt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-secondary text-xs">
                {card.ownerAvatar}
              </span>
              by{" "}
              <Link href={`/u/${card.owner}`} className="text-foreground hover:underline">
                {card.owner}
              </Link>
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" /> {card.likesCount}
            </span>
          </div>
        </div>

        {/* Branding + CTA */}
        <div className="w-full rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            made with
          </p>
          <p className="rainbow-text mt-1 font-card-sans text-2xl font-bold">PetCard</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The collectible trading-card studio for pets. Turn your own pet into a legendary card.
          </p>
          <Button asChild size="lg" className="mt-4 w-full font-bold">
            <Link href="/create">
              Create your own now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Link
            href={`/c/${card.slug}`}
            className="mt-3 inline-block text-xs text-muted-foreground hover:text-foreground"
          >
            View full card details →
          </Link>
        </div>
      </div>
    </main>
  )
}
