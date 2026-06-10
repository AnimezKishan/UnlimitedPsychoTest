import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requireGuestSession } from '#/lib/route-guards'
import { LoginView } from '#/views/auth/LoginView'

const loginSearchSchema = z.object({
  error: z.string().optional(),
})

export const Route = createFileRoute('/auth/login')({
  validateSearch: loginSearchSchema,
  beforeLoad: requireGuestSession,
  component: LoginView,
})
