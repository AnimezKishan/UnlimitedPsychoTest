import { createFileRoute } from '@tanstack/react-router'
import { AttemptResultView } from '#/views/tests/results/AttemptResultView'

export const Route = createFileRoute('/_app/tests/results/$attemptId')({
  component: AttemptResultView,
})
