import { createFileRoute } from '@tanstack/react-router'
import { AuthPageSkeleton } from '#/components/common/skeletons'
import { requireGuestSession } from '#/lib/route-guards'
import { ForgotPasswordView } from '#/views/auth/ForgotPasswordView'

export const Route = createFileRoute('/auth/forgot-password')({
  beforeLoad: requireGuestSession,
  pendingComponent: AuthPageSkeleton,
  component: ForgotPasswordView,
})
