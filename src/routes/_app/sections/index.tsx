import { createFileRoute } from '@tanstack/react-router'
import { CardGridSkeleton, PageHeaderSkeleton } from '#/components/common/skeletons'
import { SectionsListView } from '#/views/tests/SectionsListView'

function SectionsPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeaderSkeleton />
      <CardGridSkeleton count={3} />
    </div>
  )
}

export const Route = createFileRoute('/_app/sections/')({
  pendingComponent: SectionsPageSkeleton,
  component: SectionsListView,
})
