import { createFileRoute } from '@tanstack/react-router'
import { OddNumberAttemptView } from '#/views/tests/odd-number-counting/OddNumberAttemptView'

export const Route = createFileRoute('/_app/sections/$slug/attempt/$attemptId')({
  component: OddNumberAttemptView,
})
