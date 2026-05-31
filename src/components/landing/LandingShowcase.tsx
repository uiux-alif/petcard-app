import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { PetCardRecord } from "@/types/card"
import { PetCard } from "@/components/card/renderer"

interface LandingShowcaseProps {
  cards: PetCardRecord[]
}

export function LandingShowcase({ cards }: LandingShowcaseProps) {
  if (cards.length === 0) return null

  return (
    <section className="relative border-t border-border py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="rainbow-text mb-2 font-mono text-xs font-semibold uppercase tracking-[0.14em]">
              ✦ Fresh from the community
            </p>
            <h2 className="font-card-sans text-3xl font-bold tracking-tight">
              Cards trainers made today
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Hover any card to feel the holographic shine react. New ones land in the community
              feed all the time.
            </p>
          </div>
          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Horizontal scroll rail */}
        <div className="-mx-6 flex gap-8 overflow-x-auto px-6 pb-6 lg:-mx-10 lg:px-10 custom-scrollbar">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/c/${card.slug}`}
              className="group shrink-0"
              aria-label={`View ${card.name}`}
            >
              <div className="transition-transform duration-300 group-hover:-translate-y-2">
                <PetCard card={card} compact tilt interactive={false} />
              </div>
              <div className="mt-3 flex w-[220px] items-center justify-between">
                <span className="truncate text-sm font-medium">{card.name}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {card.ownerAvatar} {card.owner}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
