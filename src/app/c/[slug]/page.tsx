import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { fetchCardBySlug, hasLikedCard } from "@/lib/card/queries"
import { fetchPokemonCardBySlug } from "@/lib/pokeapi/fetch"
import { PetCard } from "@/components/card/renderer"
import { LikeButton } from "@/components/card/LikeButton"
import { getRarityConfig, getTypeConfig } from "@/lib/card/utils"
import { Button } from "@/components/ui/button"
import type { PetCardRecord } from "@/types/card"

export const dynamic = "force-dynamic"

interface CardPageProps {
  params: Promise<{ slug: string }>
}

/** Resolve a slug to a card from Supabase, or fall back to the PokéAPI feed. */
async function resolveCard(slug: string): Promise<PetCardRecord | null> {
  if (slug.startsWith("pokedex-")) {
    return fetchPokemonCardBySlug(slug)
  }
  return fetchCardBySlug(slug)
}

export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  const { slug } = await params
  const card = await resolveCard(slug)
  if (!card) return { title: "Card not found — PetCard" }
  return {
    title: `${card.name} — PetCard`,
    description: card.flavor || `${card.name}, a ${card.species} ${getTypeConfig(card.type).label} card.`,
    openGraph: {
      title: `${card.name} — PetCard`,
      description: card.flavor || `${card.name}, a collectible pet card.`,
      images: [`/c/${slug}/opengraph-image`],
    },
  }
}

export default async function CardDetailPage({ params }: CardPageProps) {
  const { slug } = await params
  const card = await resolveCard(slug)
  if (!card) notFound()

  const rarity = getRarityConfig(card.rarity)
  const type = getTypeConfig(card.type)
  const liked = card.id.startsWith("poke-") ? false : await hasLikedCard(card.id)

  return (
    <div className="relative mx-auto min-h-[calc(100vh-57px)] max-w-[1100px] px-6 py-8 lg:px-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 30%, rgba(74,222,128,0.05) 0%, transparent 65%)",
        }}
      />

      <Button asChild variant="ghost" size="sm" className="relative z-10 mb-6">
        <Link href="/community">
          <ArrowLeft className="h-4 w-4" /> Back to community
        </Link>
      </Button>

      <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-[auto_1fr]">
        <div className="flex justify-center">
          <PetCard card={card} tilt />
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2">
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

          <div>
            <h1 className="font-card-sans text-4xl font-bold tracking-tight">{card.name}</h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{card.species}</p>
          </div>

          {card.flavor && <p className="max-w-md italic text-muted-foreground">&ldquo;{card.flavor}&rdquo;</p>}

          <div className="grid max-w-md grid-cols-4 gap-3">
            {(["hp", "atk", "def", "spd"] as const).map((key) => (
              <div key={key} className="rounded-md border border-border bg-card p-3 text-center">
                <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  {key}
                </div>
                <div className="font-card-sans text-xl font-bold">{card.stats[key]}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link
              href={`/u/${card.owner}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary">
                {card.ownerAvatar}
              </span>
              <span>by {card.owner}</span>
            </Link>
            <LikeButton cardId={card.id} initialLikes={card.likesCount} initialLiked={liked} />
            <span className="font-mono text-xs text-muted-foreground">#{card.cardNumber}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
