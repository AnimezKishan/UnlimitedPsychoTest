import bcrypt from 'bcryptjs'
import { getRequest } from '@tanstack/react-start/server'
import { nanoid } from 'nanoid'
import { auth } from '#/lib/auth'
import { env } from '#/lib/env'
import { sendBrevoEmail } from '#/integrations/brevo/brevo-client'
import { activateUser, findUserById, upsertUserForInvitation } from '#/server/repositories/users-repository'
import {
  createAuditEvent,
  createInvitation,
  findUsableInvitations,
  markInvitationUsed,
  upsertCredentialAccount,
} from '#/server/repositories/auth-repository'
import { assertRateLimit } from './rate-limit-service'
import type { UserRole } from '#/lib/drizzle/schema'

const INVITATION_TTL_MS = 1000 * 60 * 60 * 24

export async function getCurrentSession(request = getRequest()) {
  return auth.api.getSession({ headers: request.headers })
}

export async function requireCurrentUser() {
  const session = await getCurrentSession()

  if (!session?.user) {
    throw new Error('UNAUTHORIZED')
  }

  if (session.user.isActive === false) {
    throw new Error('ACCOUNT_DISABLED')
  }

  return session.user
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireCurrentUser()

  if (!roles.includes(user.role as UserRole)) {
    throw new Error('FORBIDDEN')
  }

  return user
}

export async function inviteUser(input: {
  email: string
  name: string
  role?: UserRole
  actorId: string
}) {
  assertRateLimit(`invite:${input.actorId}`, { limit: 20, windowMs: 60_000 })

  const user = await upsertUserForInvitation({
    email: input.email,
    name: input.name,
    role: input.role ?? 'student',
  })

  const rawToken = nanoid(48)
  const tokenHash = await bcrypt.hash(rawToken, 12)
  const expiresAt = new Date(Date.now() + INVITATION_TTL_MS)
  await createInvitation({ userId: user.id, tokenHash, expiresAt })

  const setupUrl = new URL(env.AUTH_SETUP_PASSWORD_URL, env.APP_URL)
  setupUrl.searchParams.set('token', rawToken)

  await sendBrevoEmail({
    to: [{ email: user.email, name: user.name }],
    subject: `You're invited to ${env.APP_NAME}`,
    htmlContent: `<p>Hello ${user.name},</p><p>You have been invited to ${env.APP_NAME}.</p><p><a href="${setupUrl.toString()}">Set up your password</a></p>`,
    textContent: `Hello ${user.name}, set up your password: ${setupUrl.toString()}`,
  })

  await createAuditEvent({
    userId: user.id,
    actorId: input.actorId,
    eventType: 'user.invited',
    metadata: { role: user.role },
  })

  return { userId: user.id, email: user.email, expiresAt }
}

export async function resendInvitation(input: { userId: string; actorId: string }) {
  assertRateLimit(`resend:${input.actorId}`, { limit: 20, windowMs: 60_000 })

  const user = await findUserById(input.userId)

  if (!user) {
    throw new Error('USER_NOT_FOUND')
  }

  if (user.emailVerified) {
    throw new Error('USER_ALREADY_VERIFIED')
  }

  const rawToken = nanoid(48)
  const tokenHash = await bcrypt.hash(rawToken, 12)
  const expiresAt = new Date(Date.now() + INVITATION_TTL_MS)
  await createInvitation({ userId: user.id, tokenHash, expiresAt })

  const setupUrl = new URL(env.AUTH_SETUP_PASSWORD_URL, env.APP_URL)
  setupUrl.searchParams.set('token', rawToken)

  await sendBrevoEmail({
    to: [{ email: user.email, name: user.name }],
    subject: `Reminder: set up your ${env.APP_NAME} account`,
    htmlContent: `<p>Hello ${user.name},</p><p>Your invitation to ${env.APP_NAME} is still waiting.</p><p><a href="${setupUrl.toString()}">Set up your password</a></p>`,
    textContent: `Hello ${user.name}, set up your password: ${setupUrl.toString()}`,
  })

  await createAuditEvent({
    userId: user.id,
    actorId: input.actorId,
    eventType: 'user.invitation_resent',
  })

  return { userId: user.id, expiresAt }
}

export async function setupPassword(input: { token: string; password: string }) {
  assertRateLimit(`setup-password:${input.token.slice(0, 12)}`, {
    limit: 5,
    windowMs: 15 * 60_000,
  })

  const invitations = await findUsableInvitations()
  const matchingInvitation = await findMatchingInvitation(input.token, invitations)

  if (!matchingInvitation) {
    throw new Error('INVALID_INVITATION')
  }

  const passwordHash = await bcrypt.hash(input.password, 12)
  await upsertCredentialAccount({
    userId: matchingInvitation.userId,
    passwordHash,
  })
  await markInvitationUsed(matchingInvitation.id)
  const user = await activateUser(matchingInvitation.userId)

  await createAuditEvent({
    userId: matchingInvitation.userId,
    actorId: matchingInvitation.userId,
    eventType: 'user.password_setup',
  })

  return { success: true, userId: user.id, email: user.email }
}

async function findMatchingInvitation(
  token: string,
  invitations: Awaited<ReturnType<typeof findUsableInvitations>>,
) {
  for (const invitation of invitations) {
    if (await bcrypt.compare(token, invitation.token)) {
      return invitation
    }
  }

  return null
}
