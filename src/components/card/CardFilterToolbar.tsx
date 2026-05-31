"use client"

import { Search } from "lucide-react"
import type { CardType, RarityLevel } from "@/types/card"
import { CARD_TYPES, RARITY_LEVELS } from "@/lib/card/constants"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const ALL = "all"

interface CardFilterToolbarProps {
  search: string
  onSearch: (v: string) => void
  filterType: string
  onFilterType: (v: string) => void
  filterRarity: string
  onFilterRarity: (v: string) => void
  sortBy: string
  onSortBy: (v: string) => void
  sortOptions: { value: string; label: string }[]
}

export function CardFilterToolbar(props: CardFilterToolbarProps) {
  return (
    <div className="relative z-20 mb-8 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={props.search}
          onChange={(e) => props.onSearch(e.target.value)}
          placeholder="Search by name or species..."
          className="pl-9"
        />
      </div>
      <Select value={props.filterType} onValueChange={props.onFilterType}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All Types</SelectItem>
          {(Object.entries(CARD_TYPES) as [CardType, (typeof CARD_TYPES)[CardType]][]).map(
            ([value, config]) => (
              <SelectItem key={value} value={value}>
                {config.emoji} {config.label}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
      <Select value={props.filterRarity} onValueChange={props.onFilterRarity}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Rarities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All Rarities</SelectItem>
          {(Object.entries(RARITY_LEVELS) as [string, (typeof RARITY_LEVELS)[RarityLevel]][]).map(
            ([value, config]) => (
              <SelectItem key={value} value={value}>
                {config.symbol} {config.label}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
      <Select value={props.sortBy} onValueChange={props.onSortBy}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {props.sortOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function CardEmptyState({ label = "No cards match your search" }: { label?: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
      <Search className="h-10 w-10 opacity-40" />
      <p>{label}</p>
    </div>
  )
}
