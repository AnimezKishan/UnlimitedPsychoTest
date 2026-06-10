import { createFileRoute } from '@tanstack/react-router'
import { AttemptHistoryView } from '#/views/reports/AttemptHistoryView'

export const Route = createFileRoute('/_app/reports/')({
  component: AttemptHistoryView,
})
