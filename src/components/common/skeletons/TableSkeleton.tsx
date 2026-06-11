import { Skeleton } from '#/components/ui/skeleton'

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-7 gap-4 border-b bg-muted/30 p-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-7 gap-4 border-b p-4 last:border-b-0">
          {Array.from({ length: 7 }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
