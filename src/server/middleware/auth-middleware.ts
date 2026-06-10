import { createMiddleware } from '@tanstack/react-start'
import { getCurrentSession } from '#/server/services/auth-service'
import type { UserRole } from '#/lib/drizzle/schema'

export const authMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const session = await getCurrentSession()

  if (!session?.user) {
    throw new Error('UNAUTHORIZED')
  }

  if (session.user.isActive === false) {
    throw new Error('ACCOUNT_DISABLED')
  }

  return next({ context: { session, user: session.user } })
})

export function roleMiddleware(roles: UserRole[]) {
  return createMiddleware({ type: 'function' })
    .middleware([authMiddleware])
    .server(async ({ context, next }) => {
      if (!roles.includes(context.user.role as UserRole)) {
        throw new Error('FORBIDDEN')
      }

      return next({ context: { user: context.user, session: context.session } })
    })
}

export const adminMiddleware = roleMiddleware(['super_admin', 'admin'])
export const superAdminMiddleware = roleMiddleware(['super_admin'])
