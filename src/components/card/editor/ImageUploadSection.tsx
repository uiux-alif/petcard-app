"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { useImageUpload } from "@/hooks/use-image-upload"
import { useToast } from "@/components/providers/toast-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { uploadCardImage } from "@/lib/card/upload"
import { cn } from "@/lib/utils"

interface ImageUploadSectionProps {
  imageUrl: string | null
  onImage: (url: string) => void
}

export function ImageUploadSection({ imageUrl, onImage }: ImageUploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const { enabled, user } = useAuth()
  const [uploading, setUploading] = useState(false)

  // Reads the file as a data URL for instant local preview.
  const { error, handleFile } = useImageUpload((url) => onImage(url))

  useEffect(() => {
    if (error) toast.show(error, "error")
  }, [error, toast])

  async function onPick(file: File | undefined) {
    if (!file) return
    // Always show an instant local preview.
    handleFile(file)

    // If signed in to Supabase, also upload to Storage and swap to the hosted URL.
    if (enabled && user) {
      setUploading(true)
      const result = await uploadCardImage(file)
      setUploading(false)
      if ("url" in result) {
        onImage(result.url)
        toast.show("Photo uploaded!")
      } else {
        toast.show(result.error, "error")
      }
    } else {
      toast.show("Photo added (sign in to store it)")
    }
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={cn(
        "relative flex w-full flex-col items-center gap-1.5 overflow-hidden rounded-md border border-dashed border-border p-5 text-center transition-colors",
        "hover:border-primary hover:bg-primary/5",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
      {imageUrl ? (
        <div className="relative h-24 w-full overflow-hidden rounded">
          <Image src={imageUrl} alt="Pet preview" fill style={{ objectFit: "cover" }} unoptimized />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="text-2xl">🐾</div>
          <div className="text-xs text-muted-foreground">
            <span className="text-primary">Click to upload</span> your pet&apos;s photo
          </div>
          <div className="text-[11px] text-muted-foreground/70">JPG, PNG or WebP · max 5MB</div>
        </>
      )}
    </button>
  )
}
