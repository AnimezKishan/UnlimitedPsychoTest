import { describe, expect, it } from 'vitest'
import { generateOddNumberQuestions } from '#/utils/odd-number-counting/generator'

describe('generateOddNumberQuestions', () => {
  it('generates deterministic questions for the same attempt id', () => {
    const first = generateOddNumberQuestions('attempt-123', 5, 25, 30)
    const second = generateOddNumberQuestions('attempt-123', 5, 25, 30)

    expect(first).toEqual(second)
  })

  it('marks the correct option as the odd digit count', () => {
    const questions = generateOddNumberQuestions('attempt-456', 10, 25, 30)

    for (const question of questions) {
      const oddCount = question.digits.filter((digit) => digit % 2 === 1).length
      expect(question.correctOption).toBe(oddCount)
      expect(question.options).toContain(oddCount)
    }
  })
})
