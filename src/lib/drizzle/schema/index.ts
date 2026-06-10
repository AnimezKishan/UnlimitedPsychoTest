import { relations } from 'drizzle-orm'
import { accounts } from './accounts'
import { attemptAnswers } from './attempt-answers'
import { attempts } from './attempts'
import { auditEvents } from './audit-events'
import { invitations } from './invitations'
import { sections } from './sections'
import { sessions } from './sessions'
import { users } from './users'

export * from './accounts'
export * from './attempt-answers'
export * from './attempts'
export * from './audit-events'
export * from './invitations'
export * from './sections'
export * from './sessions'
export * from './users'
export * from './verifications'

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  invitations: many(invitations),
  attempts: many(attempts),
  auditEvents: many(auditEvents, { relationName: 'userAuditEvents' }),
  actorAuditEvents: many(auditEvents, { relationName: 'actorAuditEvents' }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const invitationsRelations = relations(invitations, ({ one }) => ({
  user: one(users, {
    fields: [invitations.userId],
    references: [users.id],
  }),
}))

export const auditEventsRelations = relations(auditEvents, ({ one }) => ({
  user: one(users, {
    fields: [auditEvents.userId],
    references: [users.id],
    relationName: 'userAuditEvents',
  }),
  actor: one(users, {
    fields: [auditEvents.actorId],
    references: [users.id],
    relationName: 'actorAuditEvents',
  }),
}))

export const sectionsRelations = relations(sections, ({ many }) => ({
  attempts: many(attempts),
}))

export const attemptsRelations = relations(attempts, ({ one, many }) => ({
  user: one(users, {
    fields: [attempts.userId],
    references: [users.id],
  }),
  section: one(sections, {
    fields: [attempts.sectionId],
    references: [sections.id],
  }),
  answers: many(attemptAnswers),
}))

export const attemptAnswersRelations = relations(attemptAnswers, ({ one }) => ({
  attempt: one(attempts, {
    fields: [attemptAnswers.attemptId],
    references: [attempts.id],
  }),
}))
