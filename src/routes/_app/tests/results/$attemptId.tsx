import { createFileRoute } from '@tanstack/react-router'
import { ResultSummarySkeleton } from '#/components/common/skeletons'
import { AttemptResultView } from '#/views/tests/results/AttemptResultView'

export const Route = createFileRoute('/_app/tests/results/$attemptId')({
  pendingComponent: ResultSummarySkeleton,
  component: AttemptResultView,
})
