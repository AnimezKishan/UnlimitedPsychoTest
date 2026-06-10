import { createFileRoute } from '@tanstack/react-router'
import { requireGuestSession } from '#/lib/route-guards'
import { ForgotPasswordView } from '#/views/auth/ForgotPasswordView'

export const Route = createFileRoute('/auth/forgot-password')({
  beforeLoad: requireGuestSession,
  component: ForgotPasswordView,
})
