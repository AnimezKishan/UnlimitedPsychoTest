import { Skeleton } from '#/components/ui/skeleton'

export function ExamScreenSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-[#eef2f7]">
      <div className="border-b bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-36" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
      <div className="border-b bg-[#d9ebf7] px-4 py-2">
        <div className="mx-auto flex max-w-7xl gap-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-9 w-48" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 border-b border-[#d5dbe3] py-3">
            <Skeleton className="h-5 w-10 shrink-0" />
            <Skeleton className="h-8 flex-1" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((__, optionIndex) => (
                <Skeleton key={optionIndex} className="h-5 w-12" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
