import type { Attempt } from '#/lib/drizzle/schema'

/** Exam timer has not started while expiresAt equals startedAt (instruction phase). */
export function isExamTimerStarted(attempt: Pick<Attempt, 'startedAt' | 'expiresAt'>) {
  return attempt.expiresAt.getTime() > attempt.startedAt.getTime() + 1000
}
