import { redirect } from '@tanstack/react-router'
import { getSessionFn } from '#/server/functions/auth-functions'
import type { UserRole } from '#/lib/drizzle/schema'

export async function requireAuthSession() {
  const session = await getSessionFn()

  if (!session?.user) {
    throw redirect({ to: '/auth/login', search: {} })
  }

  if (session.user.isActive === false) {
    throw redirect({ to: '/auth/login', search: { error: 'inactive' } })
  }

  return session
}

export async function requireGuestSession() {
  const session = await getSessionFn()

  if (session?.user) {
    throw redirect({ to: '/sections' })
  }
}

export async function requireRole(roles: UserRole[]) {
  const session = await requireAuthSession()

  if (!roles.includes(session.user.role as UserRole)) {
    throw redirect({ to: '/sections' })
  }

  return session
}

export async function requireSuperAdmin() {
  return requireRole(['super_admin'])
}
