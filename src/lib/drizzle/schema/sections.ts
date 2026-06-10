import { boolean, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const sections = pgTable('sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  questionCount: integer('question_count').notNull(),
  minTimerMinutes: integer('min_timer_minutes').notNull(),
  maxTimerMinutes: integer('max_timer_minutes').notNull(),
  isActive: boolean('is_active').notNull().default(true),
})

export type Section = typeof sections.$inferSelect
export type NewSection = typeof sections.$inferInsert
