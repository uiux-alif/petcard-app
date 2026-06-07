"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/providers/toast-provider"
import { updateProfile, deleteAccount } from "@/lib/card/actions"
import type { MyProfile } from "@/lib/card/queries"

interface SettingsFormProps {
  profile: MyProfile
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const router = useRouter()
  const toast = useToast()
  const [username, setUsername] = useState(profile.username)
  const [bio, setBio] = useState(profile.bio ?? "")
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "")
  const [pending, startTransition] = useTransition()
  const [deleting, startDelete] = useTransition()
  const [confirmText, setConfirmText] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await updateProfile({ username, bio, avatarUrl })
      if (result.ok) {
        toast.show("Profile updated", "success")
        router.refresh()
      } else {
        toast.show(result.error, "error")
      }
    })
  }

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteAccount()
      if (result.ok) {
        toast.show("Your account has been deleted", "success")
        router.push("/")
        router.refresh()
      } else {
        toast.show(result.error, "error")
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>How you appear across PetCard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">
                Email
              </Label>
              <Input id="email" value={profile.email} disabled />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                maxLength={24}
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Your public profile lives at /u/{username || "username"}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="avatar" className="text-xs">
                Avatar (emoji or image URL)
              </Label>
              <Input
                id="avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="🐾"
                maxLength={300}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                placeholder="A little about you and your pets..."
                className="min-h-[80px] resize-none"
              />
              <p className="text-[11px] text-muted-foreground">{bio.length}/160</p>
            </div>

            <Button type="submit" disabled={pending} className="font-bold">
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone — permanent account deletion (GDPR self-service). */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Delete account</CardTitle>
          <CardDescription>
            Permanently delete your account, cards, likes, and profile. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog onOpenChange={() => setConfirmText("")}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="font-bold">
                <Trash2 className="h-4 w-4" /> Delete my account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes your profile and every card you&apos;ve made. There&apos;s
                  no way to recover it. Type <strong>DELETE</strong> to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                autoComplete="off"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={confirmText !== "DELETE" || deleting}
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete()
                  }}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Delete forever
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
