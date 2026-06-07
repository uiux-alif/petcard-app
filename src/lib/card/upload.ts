import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const BUCKET = "card-images"

/** Allowed image MIME types + their canonical file extensions. */
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
}

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * Uploads a pet photo to Supabase Storage under {userId}/{filename}
 * and returns its public URL. Requires an authenticated session.
 *
 * Validates type + size here (in addition to the editor's pre-check) so the
 * stored file is always a known-safe image and the extension is derived from
 * the verified MIME type rather than the (spoofable) original filename.
 */
export async function uploadCardImage(file: File): Promise<{ url: string } | { error: string }> {
  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return { error: "Unsupported image format. Use PNG, JPG, WebP, or GIF." }
  }
  if (file.size > MAX_SIZE) {
    return { error: "Image too large (max 5MB)." }
  }

  const supabase = getSupabaseBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Sign in to upload images." }

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
