import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSessionFn } from '#/server/functions/auth-functions'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    throw redirect({ to: session?.user ? '/sections' : '/auth/login' })
  },
})
