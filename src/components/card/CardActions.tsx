"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/providers/toast-provider"
import { deleteCard } from "@/lib/card/actions"

interface CardActionsProps {
  cardId: string
  cardName: string
}

export function CardActions({ cardId, cardName }: CardActionsProps) {
  const router = useRouter()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCard(cardId)
      if (result.ok) {
        toast.show("Card deleted", "success")
        setOpen(false)
        router.refresh()
      } else {
        toast.show(result.error, "error")
      }
    })
  }

  return (
    <div className="flex items-center gap-1">
      <Button asChild size="icon" variant="ghost" className="h-7 w-7" title="Edit card">
        <Link href={`/create/${cardId}`}>
          <Pencil className="h-3.5 w-3.5" />
        </Link>
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-muted-foreground hover:text-destructive"
        title="Delete card"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{cardName}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the card from your collection. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={pending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
