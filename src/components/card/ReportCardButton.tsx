"use client"

import { useState, useTransition } from "react"
import { Flag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/providers/toast-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { reportCard } from "@/lib/card/actions"

interface ReportCardButtonProps {
  cardId: string
}

/**
 * Lets a signed-in user flag a public card for moderation review. Hidden for
 * synthetic PokéAPI cards (their ids start with "pokedex-") since they aren't
 * user-generated content.
 */
export function ReportCardButton({ cardId }: ReportCardButtonProps) {
  const toast = useToast()
  const { user, enabled } = useAuth()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [pending, startTransition] = useTransition()

  // Don't offer reporting on sample cards.
  if (cardId.startsWith("pokedex-")) return null

  function handleSubmit() {
    if (enabled && !user) {
      toast.show("Sign in to report a card.", "error")
      return
    }
    startTransition(async () => {
      const result = await reportCard(cardId, reason)
      if (result.ok) {
        toast.show("Thanks — our team will review this card.", "success")
        setOpen(false)
        setReason("")
      } else {
        toast.show(result.error, "error")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
        >
          <Flag className="h-3.5 w-3.5" /> Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this card</DialogTitle>
          <DialogDescription>
            Tell us what&apos;s wrong — inappropriate content, spam, or something else. Reports are
            reviewed by our team.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          placeholder="What's the issue with this card?"
          className="min-h-[90px] resize-none"
        />
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={pending || reason.trim().length < 3}
            variant="destructive"
            className="font-bold"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
