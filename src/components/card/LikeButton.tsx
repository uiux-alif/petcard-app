"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/components/providers/toast-provider"
import { toggleLike } from "@/lib/card/actions"

interface LikeButtonProps {
  cardId: string
  initialLikes: number
  initialLiked: boolean
}

export function LikeButton({ cardId, initialLikes, initialLiked }: LikeButtonProps) {
  const router = useRouter()
  const { enabled, user } = useAuth()
  const toast = useToast()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialLikes)
  const [, startTransition] = useTransition()

  function handleClick() {
    if (enabled && !user) {
      toast.show("Sign in to like cards", "info")
      router.push("/login?next=/community")
      return
    }
    if (!enabled) {
      toast.show("Connect Supabase to like cards", "info")
      return
    }

    // Optimistic update
    const nextLiked = !liked
    setLiked(nextLiked)
    setCount((c) => c + (nextLiked ? 1 : -1))

    startTransition(async () => {
      const result = await toggleLike(cardId)
      if (!result.ok) {
        // Revert on failure
        setLiked(!nextLiked)
        setCount((c) => c + (nextLiked ? -1 : 1))
        toast.show(result.error, "error")
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1 text-xs transition-colors",
        liked ? "text-rose-400" : "text-muted-foreground hover:text-rose-400",
      )}
      aria-pressed={liked}
      aria-label={liked ? "Unlike card" : "Like card"}
    >
      <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
      {count}
    </button>
  )
}
