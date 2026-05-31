import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-4xl">🔍</div>
      <h1 className="font-card-sans text-2xl font-bold">Card not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        This page or card doesn&apos;t exist, or it&apos;s private.
      </p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/community">Browse community</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/create">Create a card</Link>
        </Button>
      </div>
    </div>
  )
}
