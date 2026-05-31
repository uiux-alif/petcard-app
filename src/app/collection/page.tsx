import { fetchMyCards } from "@/lib/card/queries"
import { hasSupabaseEnv } from "@/lib/supabase/env"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { COLLECTION_CARDS, USER_INFO } from "@/data/seeds"
import { CollectionView } from "./collection-view"

export const dynamic = "force-dynamic"

export default async function CollectionPage() {
  if (!hasSupabaseEnv()) {
    // Demo mode — show seed cards.
    return (
      <CollectionView
        cards={COLLECTION_CARDS}
        userName={USER_INFO.name}
        userAvatar={USER_INFO.avatar}
        joined={USER_INFO.joined}
      />
    )
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const cards = await fetchMyCards()

  const email = user?.email ?? "trainer"
  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { month: "short", year: "numeric" })
    : USER_INFO.joined

  return (
    <CollectionView
      cards={cards}
      userName={email.split("@")[0] ?? "trainer"}
      userAvatar={email[0]?.toUpperCase() ?? "🐾"}
      joined={joined}
      editable
    />
  )
}
