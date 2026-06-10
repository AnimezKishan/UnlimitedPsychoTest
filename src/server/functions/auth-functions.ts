import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { userRoleEnum } from '#/lib/drizzle/schema'
import { adminMiddleware, authMiddleware } from '#/server/middleware/auth-middleware'
import { getCurrentSession, inviteUser, resendInvitation, setupPassword } from '#/server/services/auth-service'

const roleSchema = z.enum(userRoleEnum.enumValues)

const inviteUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: roleSchema.default('student'),
})

const setupPasswordSchema = z.object({
  token: z.string().min(24),
  password: z.string().min(8).max(128),
})

export const inviteUserFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(inviteUserSchema)
  .handler(async ({ data, context }) =>
    inviteUser({ ...data, actorId: context.user.id }),
  )

const resendInvitationSchema = z.object({
  userId: z.string().uuid(),
})

export const resendInvitationFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(resendInvitationSchema)
  .handler(async ({ data, context }) =>
    resendInvitation({ userId: data.userId, actorId: context.user.id }),
  )

export const setupPasswordFn = createServerFn({ method: 'POST' })
  .validator(setupPasswordSchema)
  .handler(async ({ data }) => setupPassword(data))

export const getSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getCurrentSession()

  return session
    ? {
        user: session.user,
        session: session.session,
      }
    : null
})

export const requireUserFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => ({ user: context.user }))
