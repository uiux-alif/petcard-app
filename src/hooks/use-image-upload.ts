"use client"

import { useCallback, useState } from "react"

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

interface UseImageUploadResult {
  error: string | null
  handleFile: (file: File | null | undefined) => void
}

/**
 * Reads an image file as a data URL after validating type + size.
 * Calls onImage with the resulting data URL.
 */
export function useImageUpload(onImage: (url: string) => void): UseImageUploadResult {
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) return
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file")
        return
      }
      if (file.size > MAX_SIZE) {
        setError("Image too large (max 5MB)")
        return
      }
      setError(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === "string") onImage(result)
      }
      reader.readAsDataURL(file)
    },
    [onImage],
  )

  return { error, handleFile }
}
