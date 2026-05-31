import { notFound, redirect } from "next/navigation"
import { CardEditor } from "@/components/card/editor/CardEditor"
import { fetchOwnedCardById } from "@/lib/card/queries"
import { hasSupabaseEnv } from "@/lib/supabase/env"
import type { CardData } from "@/types/card"

export const dynamic = "force-dynamic"

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCardPage({ params }: EditPageProps) {
  const { id } = await params

  if (!hasSupabaseEnv()) {
    // No backend configured — editing isn't available.
    redirect("/create")
  }

  const record = await fetchOwnedCardById(id)
  if (!record) notFound()

  // Reduce the record to just the CardData fields for the editor.
  const cardData: CardData = {
    name: record.name,
    species: record.species,
    stage: record.stage,
    type: record.type,
    rarity: record.rarity,
    imageUrl: record.imageUrl,
    stats: record.stats,
    moves: record.moves,
    flavor: record.flavor,
    cardNumber: record.cardNumber,
    template: record.template,
    holo: record.holo,
    holoStrength: record.holoStrength,
    font: record.font,
  }

  return <CardEditor cardId={id} initialCard={cardData} initialPublic={record.isPublic} />
}
