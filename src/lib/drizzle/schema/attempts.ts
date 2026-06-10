import { integer, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { sections } from './sections'
import { users } from './users'

export const attemptStatusEnum = pgEnum('attempt_status', ['in_progress', 'submitted', 'expired'])

export const attempts = pgTable('attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sectionId: uuid('section_id')
    .notNull()
    .references(() => sections.id, { onDelete: 'restrict' }),
  status: attemptStatusEnum('status').notNull().default('in_progress'),
  timerMinutes: integer('timer_minutes').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  score: integer('score'),
  correctCount: integer('correct_count'),
  incorrectCount: integer('incorrect_count'),
  unattemptedCount: integer('unattempted_count'),
})

export type Attempt = typeof attempts.$inferSelect
export type NewAttempt = typeof attempts.$inferInsert
export type AttemptStatus = (typeof attemptStatusEnum.enumValues)[number]
