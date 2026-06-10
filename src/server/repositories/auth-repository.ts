import { and, eq, gt, isNull } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { db } from '#/lib/drizzle/client'
import { accounts, auditEvents, invitations } from '#/lib/drizzle/schema'

export async function createInvitation(input: {
  userId: string
  tokenHash: string
  expiresAt: Date
}) {
  const [invitation] = await db
    .insert(invitations)
    .values({
      userId: input.userId,
      token: input.tokenHash,
      expiresAt: input.expiresAt,
    })
    .returning()

  return invitation
}

export async function findUsableInvitations() {
  return db.query.invitations.findMany({
    where: and(isNull(invitations.usedAt), gt(invitations.expiresAt, new Date())),
    with: { user: true },
  })
}

export async function markInvitationUsed(id: string) {
  const [invitation] = await db
    .update(invitations)
    .set({ usedAt: new Date() })
    .where(eq(invitations.id, id))
    .returning()

  return invitation
}

export async function upsertCredentialAccount(input: { userId: string; passwordHash: string }) {
  const [account] = await db
    .insert(accounts)
    .values({
      id: nanoid(),
      userId: input.userId,
      accountId: input.userId,
      providerId: 'credential',
      password: input.passwordHash,
    })
    .onConflictDoUpdate({
      target: [accounts.providerId, accounts.accountId],
      set: {
        password: input.passwordHash,
        updatedAt: new Date(),
      },
    })
    .returning()

  return account
}

export async function createAuditEvent(input: {
  userId?: string | null
  actorId?: string | null
  eventType: string
  metadata?: Record<string, unknown>
}) {
  const [event] = await db
    .insert(auditEvents)
    .values({
      userId: input.userId ?? null,
      actorId: input.actorId ?? null,
      eventType: input.eventType,
      metadata: input.metadata ?? {},
    })
    .returning()

  return event
}
