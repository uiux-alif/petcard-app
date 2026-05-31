"use client"

import { useMemo, useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import type { CardType, RarityLevel, PetCardRecord } from "@/types/card"
import { CardGridItem } from "@/components/card/CardGridItem"
import { CardFilterToolbar, CardEmptyState, ALL } from "@/components/card/CardFilterToolbar"
import { Button } from "@/components/ui/button"
import { loadMoreCommunity } from "@/lib/card/actions"

const PAGE_SIZE = 24

interface CommunityViewProps {
  cards: PetCardRecord[]
  /** Ids of cards the current user has liked. */
  likedIds?: string[]
  /** When true, like buttons toggle against Supabase + load-more is enabled. */
  interactive?: boolean
  /** How many of the leading cards are real user-published cards. */
  userCardCount?: number
}

export function CommunityView({
  cards: initialCards,
  likedIds = [],
  interactive = false,
  userCardCount = 0,
}: CommunityViewProps) {
  const [cards, setCards] = useState(initialCards)
  const [likedSetIds, setLikedSetIds] = useState(likedIds)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialCards.length >= PAGE_SIZE)
  const [loadingMore, startLoadMore] = useTransition()

  const likedSet = useMemo(() => new Set(likedSetIds), [likedSetIds])
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<string>(ALL)
  const [filterRarity, setFilterRarity] = useState<string>(ALL)
  const [sortBy, setSortBy] = useState("newest")

  const filteredCards = useMemo(() => {
    let list = [...cards]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.species.toLowerCase().includes(q) ||
          c.owner.toLowerCase().includes(q),
      )
    }
    if (filterType !== ALL) list = list.filter((c) => c.type === (filterType as CardType))
    if (filterRarity !== ALL) list = list.filter((c) => c.rarity === (Number(filterRarity) as RarityLevel))

    switch (sortBy) {
      case "rarity":
        list.sort((a, b) => b.rarity - a.rarity)
        break
      case "hp":
        list.sort((a, b) => b.stats.hp - a.stats.hp)
        break
      case "likes":
        list.sort((a, b) => b.likesCount - a.likesCount)
        break
      case "newest":
        // Real user cards (current timestamps) naturally lead the synthetic feed.
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        break
    }
    return list
  }, [cards, search, filterType, filterRarity, sortBy])

  function handleLoadMore() {
    const nextPage = page + 1
    startLoadMore(async () => {
      const { cards: more, likedIds: moreLiked } = await loadMoreCommunity(nextPage)
      if (more.length === 0) {
        setHasMore(false)
        return
      }
      // De-dupe by id when merging pages.
      setCards((prev) => {
        const seen = new Set(prev.map((c) => c.id))
        return [...prev, ...more.filter((c) => !seen.has(c.id))]
      })
      setLikedSetIds((prev) => Array.from(new Set([...prev, ...moreLiked])))
      setPage(nextPage)
      if (more.length < PAGE_SIZE) setHasMore(false)
    })
  }

  return (
    <div className="relative mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 70% 20%, rgba(74,222,128,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 py-10 text-center">
        <h1 className="font-card-sans text-3xl font-bold">
          Welcome to the <span className="rainbow-text">Community</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          {userCardCount > 0
            ? `${userCardCount} card${userCardCount === 1 ? "" : "s"} from real trainers, plus a Pokédex to explore`
            : "Discover amazing pet cards created by fellow trainers"}
        </p>
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
          { value: "newest", label: "Newest" },
          { value: "rarity", label: "Rarest" },
          { value: "hp", label: "Highest HP" },
          { value: "likes", label: "Most Liked" },
        ]}
      />

      {filteredCards.length === 0 ? (
        <CardEmptyState label="No cards found" />
      ) : (
        <>
          <div className="relative z-10 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCards.map((card) => (
              <CardGridItem
                key={card.id}
                card={card}
                showOwner
                liked={likedSet.has(card.id)}
                interactiveLikes={interactive}
                href={`/c/${card.slug}`}
              />
            ))}
          </div>

          {hasMore && (
            <div className="relative z-10 mt-10 flex justify-center">
              <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
