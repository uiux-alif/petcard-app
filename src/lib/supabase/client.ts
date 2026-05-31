"use client"

import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseEnv } from "./env"
import type { Database } from "./types"

/**
 * Browser Supabase client (singleton).
 * Uses the publishable/anon key — all access is RLS-enforced.
 */
let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function getSupabaseBrowserClient() {
  if (client) return client
  const { url, anonKey } = getSupabaseEnv()
  client = createBrowserClient<Database>(url, anonKey)
  return client
}
