import { createFileRoute } from '@tanstack/react-router'
import { AuthPageSkeleton } from '#/components/common/skeletons'
import { requireGuestSession } from '#/lib/route-guards'
import { ResetPasswordView } from '#/views/auth/ResetPasswordView'

export const Route = createFileRoute('/auth/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  beforeLoad: requireGuestSession,
  pendingComponent: AuthPageSkeleton,
  component: ResetPasswordView,
})
