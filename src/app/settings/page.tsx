import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { fetchMyProfile } from "@/lib/card/queries"
import { hasSupabaseEnv } from "@/lib/supabase/env"
import { SettingsForm } from "./settings-form"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Settings — PetCard",
}

export default async function SettingsPage() {
  if (!hasSupabaseEnv()) redirect("/")

  const profile = await fetchMyProfile()
  if (!profile) redirect("/login?next=/settings")

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="mb-6 font-card-sans text-2xl font-bold">Settings</h1>
      <SettingsForm profile={profile} />
    </div>
  )
}
