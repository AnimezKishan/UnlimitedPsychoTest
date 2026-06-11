import { createFileRoute } from '@tanstack/react-router'
import { ExamScreenSkeleton } from '#/components/common/skeletons'
import { SectionAttemptView } from '#/views/tests/SectionAttemptView'

export const Route = createFileRoute('/_exam/sections/$slug/attempt/$attemptId')({
  pendingComponent: ExamScreenSkeleton,
  component: SectionAttemptView,
})
