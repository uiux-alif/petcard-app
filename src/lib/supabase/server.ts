import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseEnv } from "./env"
import type { Database } from "./types"

/**
 * Server Supabase client for Server Components, Route Handlers, and Actions.
 * Reads/writes the auth session via Next.js cookies.
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = getSupabaseEnv()

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Called from a Server Component — middleware refreshes the session.
        }
      },
    },
  })
}
