import { describe, expect, it } from 'vitest'
import { isExamTimerStarted } from '#/utils/exam/exam-timer-state'

describe('isExamTimerStarted', () => {
  it('returns false when expiresAt equals startedAt', () => {
    const startedAt = new Date('2026-01-01T12:00:00.000Z')
    expect(
      isExamTimerStarted({
        startedAt,
        expiresAt: new Date(startedAt.getTime()),
      }),
    ).toBe(false)
  })

  it('returns true when expiresAt is after startedAt by more than one second', () => {
    const startedAt = new Date('2026-01-01T12:00:00.000Z')
    expect(
      isExamTimerStarted({
        startedAt,
        expiresAt: new Date(startedAt.getTime() + 8 * 60_000),
      }),
    ).toBe(true)
  })
})
