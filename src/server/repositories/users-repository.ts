import { and, desc, eq, gt, ilike, isNull } from 'drizzle-orm'
import { db } from '#/lib/drizzle/client'
import { invitations, type NewUser, type UserRole, users } from '#/lib/drizzle/schema'

export type CreateUserInput = Pick<NewUser, 'name' | 'email'> & {
  role?: UserRole
  isActive?: boolean
  emailVerified?: boolean
}

export async function findUserById(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) })
}

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) })
}

export async function createUser(input: CreateUserInput) {
  const [user] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email.toLowerCase(),
      role: input.role ?? 'student',
      isActive: input.isActive ?? true,
      emailVerified: input.emailVerified ?? false,
    })
    .returning()

  return user
}

export async function upsertUserForInvitation(input: CreateUserInput) {
  const existingUser = await findUserByEmail(input.email)

  if (existingUser) {
    const [updatedUser] = await db
      .update(users)
      .set({
        name: input.name,
        role: input.role ?? existingUser.role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingUser.id))
      .returning()

    return updatedUser
  }

  return createUser({ ...input, isActive: true, emailVerified: false })
}

export async function activateUser(id: string) {
  const [user] = await db
    .update(users)
    .set({ isActive: true, emailVerified: true, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning()

  return user
}

export async function setUserActive(id: string, isActive: boolean) {
  const [user] = await db
    .update(users)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning()

  return user
}

export async function listUsers(input?: { search?: string; role?: UserRole }) {
  const filters = [input?.role ? eq(users.role, input.role) : undefined]

  if (input?.search) {
    filters.push(ilike(users.email, `%${input.search}%`))
  }

  return db.query.users.findMany({
    where: and(...filters.filter((filter) => filter !== undefined)),
    orderBy: desc(users.createdAt),
    limit: 100,
    with: {
      invitations: {
        where: and(isNull(invitations.usedAt), gt(invitations.expiresAt, new Date())),
        limit: 1,
      },
      accounts: true,
    },
  })
}

export async function findPendingInvitation(userId: string) {
  return db.query.invitations.findFirst({
    where: and(
      eq(invitations.userId, userId),
      isNull(invitations.usedAt),
      gt(invitations.expiresAt, new Date()),
    ),
  })
}
