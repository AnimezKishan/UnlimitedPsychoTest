import { createFileRoute } from '@tanstack/react-router'
import { requireGuestSession } from '#/lib/route-guards'
import { ResetPasswordView } from '#/views/auth/ResetPasswordView'

export const Route = createFileRoute('/auth/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  beforeLoad: requireGuestSession,
  component: ResetPasswordView,
})
