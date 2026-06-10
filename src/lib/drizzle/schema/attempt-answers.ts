import { boolean, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { attempts } from './attempts'

export const attemptAnswers = pgTable('attempt_answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  attemptId: uuid('attempt_id')
    .notNull()
    .references(() => attempts.id, { onDelete: 'cascade' }),
  questionIndex: integer('question_index').notNull(),
  selectedOption: text('selected_option'),
  correctOption: text('correct_option').notNull(),
  isCorrect: boolean('is_correct'),
})

export type AttemptAnswer = typeof attemptAnswers.$inferSelect
export type NewAttemptAnswer = typeof attemptAnswers.$inferInsert
