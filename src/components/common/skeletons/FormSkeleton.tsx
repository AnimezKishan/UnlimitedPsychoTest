import { Skeleton } from '#/components/ui/skeleton'

export function FormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
