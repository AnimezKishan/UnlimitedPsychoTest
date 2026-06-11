import { createFileRoute } from '@tanstack/react-router'
import { HistoryPageSkeleton } from '#/components/common/skeletons'
import { AttemptHistoryView } from '#/views/reports/AttemptHistoryView'

export const Route = createFileRoute('/_app/reports/')({
  pendingComponent: HistoryPageSkeleton,
  component: AttemptHistoryView,
})
