import { CardGridSkeleton } from "@/components/card/CardGridSkeleton"

export default function CommunityLoading() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
      <div className="py-10 text-center">
        <h1 className="font-card-sans text-3xl font-bold">
          Welcome to the <span className="rainbow-text">Community</span>
        </h1>
        <p className="mt-3 text-muted-foreground">Loading cards…</p>
      </div>
      <CardGridSkeleton count={12} />
    </div>
  )
}
