import { describe, expect, it } from 'vitest'
import { generateOddNumberSumQuestions, sumOddDigits } from '#/utils/odd-number-sum/generator'

describe('generateOddNumberSumQuestions', () => {
  it('generates deterministic questions for the same attempt id', () => {
    const first = generateOddNumberSumQuestions('attempt-sum-123', 5, 34, 38)
    const second = generateOddNumberSumQuestions('attempt-sum-123', 5, 34, 38)

    expect(first).toEqual(second)
  })

  it('marks the correct option as the sum of odd digits', () => {
    const questions = generateOddNumberSumQuestions('attempt-sum-456', 10, 34, 38)

    for (const question of questions) {
      const oddSum = sumOddDigits(question.digits)
      expect(question.correctOption).toBe(oddSum)
      expect(question.options).toContain(oddSum)
    }
  })

  it('generates between 34 and 38 numbers per question', () => {
    const questions = generateOddNumberSumQuestions('attempt-sum-789', 10, 34, 38)

    for (const question of questions) {
      expect(question.digits.length).toBeGreaterThanOrEqual(34)
      expect(question.digits.length).toBeLessThanOrEqual(38)
    }
  })

  it('generates unique options including the correct answer', () => {
    const questions = generateOddNumberSumQuestions('attempt-sum-101', 10, 34, 38)

    for (const question of questions) {
      expect(question.options).toHaveLength(4)
      expect(new Set(question.options).size).toBe(4)
      expect(question.options).toContain(question.correctOption)
    }
  })

  it('uses numbers between 1 and 9', () => {
    const questions = generateOddNumberSumQuestions('attempt-sum-202', 10, 34, 38)

    for (const question of questions) {
      for (const digit of question.digits) {
        expect(digit).toBeGreaterThanOrEqual(1)
        expect(digit).toBeLessThanOrEqual(9)
      }
    }
  })
})
