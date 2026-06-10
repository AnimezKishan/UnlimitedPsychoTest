import { createFileRoute } from '@tanstack/react-router'
import { requireGuestSession } from '#/lib/route-guards'
import { SetupPasswordView } from '#/views/auth/SetupPasswordView'

export const Route = createFileRoute('/auth/setup-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  beforeLoad: requireGuestSession,
  component: SetupPasswordView,
})
