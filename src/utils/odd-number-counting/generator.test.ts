import { describe, expect, it } from 'vitest'
import { generateOddNumberQuestions } from '#/utils/odd-number-counting/generator'

describe('generateOddNumberQuestions', () => {
  it('generates deterministic questions for the same attempt id', () => {
    const first = generateOddNumberQuestions('attempt-123', 5, 45, 50)
    const second = generateOddNumberQuestions('attempt-123', 5, 45, 50)

    expect(first).toEqual(second)
  })

  it('marks the correct option as the odd digit count', () => {
    const questions = generateOddNumberQuestions('attempt-456', 10, 45, 50)

    for (const question of questions) {
      const oddCount = question.digits.filter((digit) => digit % 2 === 1).length
      expect(question.correctOption).toBe(oddCount)
      expect(question.options).toContain(oddCount)
    }
  })

  it('generates between 45 and 50 digits per question', () => {
    const questions = generateOddNumberQuestions('attempt-789', 10, 45, 50)

    for (const question of questions) {
      expect(question.digits.length).toBeGreaterThanOrEqual(45)
      expect(question.digits.length).toBeLessThanOrEqual(50)
    }
  })
})
