import { Skeleton } from '#/components/ui/skeleton'
import { FormSkeleton } from './FormSkeleton'

export function AuthPageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Skeleton className="h-12 w-48" />
        <div className="flex w-full flex-col items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-full" />
        </div>
        <FormSkeleton />
      </div>
    </div>
  )
}
