import { createFileRoute } from '@tanstack/react-router'
import { AuthPageSkeleton } from '#/components/common/skeletons'
import { requireGuestSession } from '#/lib/route-guards'
import { SetupPasswordView } from '#/views/auth/SetupPasswordView'

export const Route = createFileRoute('/auth/setup-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  beforeLoad: requireGuestSession,
  pendingComponent: AuthPageSkeleton,
  component: SetupPasswordView,
})
