import { CardGridSkeleton } from "@/components/card/CardGridSkeleton"

export default function CollectionLoading() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
      <div className="py-8">
        <h1 className="font-card-sans text-2xl font-bold">Loading your collection…</h1>
      </div>
      <CardGridSkeleton count={8} />
    </div>
  )
}
