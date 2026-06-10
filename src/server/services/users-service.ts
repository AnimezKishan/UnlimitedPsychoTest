import { findUserById, listUsers, setUserActive } from '#/server/repositories/users-repository'
import { createAuditEvent } from '#/server/repositories/auth-repository'
import type { UserRole } from '#/lib/drizzle/schema'

export async function getUserProfile(id: string) {
  const user = await findUserById(id)

  if (!user) {
    throw new Error('USER_NOT_FOUND')
  }

  return user
}

export async function getUsers(input?: { search?: string; role?: UserRole }) {
  return listUsers(input)
}

export async function updateUserActiveState(input: {
  userId: string
  isActive: boolean
  actorId: string
}) {
  const user = await setUserActive(input.userId, input.isActive)

  if (!user) {
    throw new Error('USER_NOT_FOUND')
  }

  await createAuditEvent({
    userId: input.userId,
    actorId: input.actorId,
    eventType: input.isActive ? 'user.activated' : 'user.deactivated',
  })

  return user
}
