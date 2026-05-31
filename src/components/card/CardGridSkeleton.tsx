import { Skeleton } from "@/components/ui/skeleton"

interface CardGridSkeletonProps {
  count?: number
}

/** Placeholder grid matching the compact card aspect ratio. */
export function CardGridSkeleton({ count = 8 }: CardGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <Skeleton className="h-[308px] w-[220px] rounded-[14px]" />
          <div className="flex w-[220px] items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      ))}
    </div>
  )
}
