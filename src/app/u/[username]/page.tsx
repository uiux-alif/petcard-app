import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { fetchProfile } from "@/lib/card/queries"
import { CardGridItem } from "@/components/card/CardGridItem"
import { CardEmptyState } from "@/components/card/CardFilterToolbar"

export const dynamic = "force-dynamic"

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  return {
    title: `${username} — PetCard`,
    description: `${username}'s collectible pet cards on PetCard.`,
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const profile = await fetchProfile(username)
  if (!profile) notFound()

  const joinedLabel = new Date(profile.joined).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  })
  const totalLikes = profile.cards.reduce((sum, c) => sum + c.likesCount, 0)

  return (
    <div className="relative mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 10%, rgba(74,222,128,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Profile header */}
      <div className="relative z-10 flex flex-col items-center gap-3 py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-secondary text-3xl">
          {profile.avatarUrl ?? "🐾"}
        </div>
        <h1 className="font-card-sans text-3xl font-bold">
          <span className="rainbow-text">{profile.username}</span>
        </h1>
        {profile.bio && <p className="max-w-md text-muted-foreground">{profile.bio}</p>}
        <div className="flex gap-6 font-mono text-xs text-muted-foreground">
          <span>{profile.cards.length} public cards</span>
          <span>{totalLikes} total likes</span>
          <span>joined {joinedLabel}</span>
        </div>
      </div>

      {profile.cards.length === 0 ? (
        <CardEmptyState label="No public cards yet" />
      ) : (
        <div className="relative z-10 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profile.cards.map((card) => (
            <CardGridItem key={card.id} card={card} showOwner href={`/c/${card.slug}`} />
          ))}
        </div>
      )}
    </div>
  )
}
