import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const BUCKET = "card-images"

/**
 * Uploads a pet photo to Supabase Storage under {userId}/{filename}
 * and returns its public URL. Requires an authenticated session.
 */
export async function uploadCardImage(file: File): Promise<{ url: string } | { error: string }> {
  const supabase = getSupabaseBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Sign in to upload images." }

  const ext = file.name.split(".").pop()?.toLowerCase() || "png"
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  })
  if (error) return { error: error.message }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl }
}
