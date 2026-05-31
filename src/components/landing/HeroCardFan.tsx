"use client"

import { useState, useTransition } from "react"
import { Shuffle, Loader2 } from "lucide-react"
import type { PetCardRecord } from "@/types/card"
import { PetCard } from "@/components/card/renderer"
import { Button } from "@/components/ui/button"
import { shuffleShowcaseCards } from "@/lib/card/actions"

interface HeroCardFanProps {
  initialCards: PetCardRecord[]
}

// Loose, non-rigid fan layout — middle card lifted, sides rotated outward.
const FAN = [
  { rotate: -10, x: -150, y: 28, z: 1 },
  { rotate: 2, x: 0, y: -10, z: 3 },
  { rotate: 11, x: 150, y: 34, z: 2 },
]

export function HeroCardFan({ initialCards }: HeroCardFanProps) {
  const [cards, setCards] = useState(initialCards.slice(0, 3))
  const [pending, startShuffle] = useTransition()

  function shuffle() {
    startShuffle(async () => {
      const next = await shuffleShowcaseCards(3)
      if (next.length) setCards(next)
    })
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Fanned cards — overlap on desktop, stack/scroll-friendly on mobile */}
      <div className="relative flex h-[420px] w-full items-center justify-center sm:h-[440px]">
        {cards.map((card, i) => {
          const f = FAN[i] ?? FAN[1]!
          return (
            <div
              key={`${card.id}-${i}`}
              className="absolute origin-bottom transition-all duration-500 ease-out hover:!translate-y-[-20px] hover:!rotate-0 hover:z-50"
              style={{
                transform: `translateX(${f.x}px) translateY(${f.y}px) rotate(${f.rotate}deg)`,
                zIndex: f.z,
                opacity: pending ? 0.55 : 1,
              }}
            >
              <PetCard card={card} compact tilt interactive={false} />
            </div>
          )
        })}
      </div>

      <Button onClick={shuffle} disabled={pending} variant="outline" className="font-bold">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shuffle className="h-4 w-4" />}
        Random cards
      </Button>
    </div>
  )
}
