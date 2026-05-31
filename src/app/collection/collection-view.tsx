"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import type { CardType, RarityLevel, PetCardRecord } from "@/types/card"
import { CardGridItem } from "@/components/card/CardGridItem"
import { CardFilterToolbar, CardEmptyState, ALL } from "@/components/card/CardFilterToolbar"
import { Button } from "@/components/ui/button"

interface CollectionViewProps {
  cards: PetCardRecord[]
  userName: string
  userAvatar: string
  joined: string
  /** When true, cards show edit/delete actions (real owned cards). */
  editable?: boolean
}

export function CollectionView({
  cards: allCards,
  userName,
  userAvatar,
  joined,
  editable = false,
}: CollectionViewProps) {
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<string>(ALL)
  const [filterRarity, setFilterRarity] = useState<string>(ALL)
  const [sortBy, setSortBy] = useState("name")

  const filteredCards = useMemo(() => {
    let cards = [...allCards]
    if (search) {
      const q = search.toLowerCase()
      cards = cards.filter(
        (c) => c.name.toLowerCase().includes(q) || c.species.toLowerCase().includes(q),
      )
    }
    if (filterType !== ALL) cards = cards.filter((c) => c.type === (filterType as CardType))
    if (filterRarity !== ALL) cards = cards.filter((c) => c.rarity === (Number(filterRarity) as RarityLevel))

    cards.sort((a, b) => {
      switch (sortBy) {
        case "rarity":
          return b.rarity - a.rarity
        case "hp":
          return b.stats.hp - a.stats.hp
        default:
          return a.name.localeCompare(b.name)
      }
    })
    return cards
  }, [allCards, search, filterType, filterRarity, sortBy])

  const totalCards = allCards.length
  const rareCards = allCards.filter((c) => c.rarity >= 3).length
  const uniqueTypes = new Set(allCards.map((c) => c.type)).size
  const totalHp = allCards.reduce((sum, c) => sum + c.stats.hp, 0)

  return (
    <div className="relative mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 30% 20%, rgba(74,222,128,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mb-7 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full border-2 border-border bg-secondary text-xl">
            {userAvatar}
          </div>
          <div>
            <h1 className="font-card-sans text-2xl font-bold">
              Welcome, <span className="rainbow-text">{userName}</span>
            </h1>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              Member since {joined} · {filteredCards.length} cards
            </p>
          </div>
        </div>
        <Button asChild className="font-bold">
          <Link href="/create">
            <Plus className="h-4 w-4" /> Create New Card
          </Link>
        </Button>
      </div>

      <div className="relative z-10 mb-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard value={totalCards} label="Total Cards" />
        <StatCard value={rareCards} label="Rare ★★★" />
        <StatCard value={uniqueTypes} label="Types" />
        <StatCard value={totalHp} label="Total HP" />
      </div>

      <CardFilterToolbar
        search={search}
        onSearch={setSearch}
        filterType={filterType}
        onFilterType={setFilterType}
        filterRarity={filterRarity}
        onFilterRarity={setFilterRarity}
        sortBy={sortBy}
        onSortBy={setSortBy}
        sortOptions={[
          { value: "name", label: "Name" },
          { value: "rarity", label: "Rarity" },
          { value: "hp", label: "HP" },
        ]}
      />

      {filteredCards.length === 0 ? (
        <CardEmptyState label={allCards.length === 0 ? "No cards yet — create your first one!" : undefined} />
      ) : (
        <div className="relative z-10 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCards.map((card) => (
            <CardGridItem
              key={card.id}
              card={card}
              editable={editable}
              href={`/c/${card.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-card p-5">
      <span className="font-card-sans text-2xl font-bold">{value.toLocaleString()}</span>
      <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  )
}
