import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { userRoleEnum } from '#/lib/drizzle/schema'
import { adminMiddleware, authMiddleware } from '#/server/middleware/auth-middleware'
import { getUserProfile, getUsers, updateUserActiveState } from '#/server/services/users-service'

const roleSchema = z.enum(userRoleEnum.enumValues)

const listUsersSchema = z.object({
  search: z.string().optional(),
  role: roleSchema.optional(),
})

const updateUserActiveSchema = z.object({
  userId: z.string().uuid(),
  isActive: z.boolean(),
})

export const listUsersFn = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .validator(listUsersSchema.optional())
  .handler(async ({ data }) => getUsers(data))

export const getMyProfileFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => getUserProfile(context.user.id))

export const updateUserActiveFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(updateUserActiveSchema)
  .handler(async ({ data, context }) =>
    updateUserActiveState({ ...data, actorId: context.user.id }),
  )
