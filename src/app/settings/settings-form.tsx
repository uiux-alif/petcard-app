"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/providers/toast-provider"
import { updateProfile } from "@/lib/card/actions"
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

  return (
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
  )
}
