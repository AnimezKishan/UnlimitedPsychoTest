import { describe, expect, it } from 'vitest'
import {
  formatOddSumExpression,
  SUM_INSTRUCTION_EXAMPLE,
  sumOddDigits,
} from '#/utils/exam/sum-instruction-example'

describe('sum instruction example', () => {
  it('uses 34 to 38 numbers', () => {
    expect(SUM_INSTRUCTION_EXAMPLE.digits.length).toBeGreaterThanOrEqual(34)
    expect(SUM_INSTRUCTION_EXAMPLE.digits.length).toBeLessThanOrEqual(38)
  })

  it('matches answer to the sum of odd digits', () => {
    const oddSum = sumOddDigits(SUM_INSTRUCTION_EXAMPLE.digits)
    expect(oddSum).toBe(SUM_INSTRUCTION_EXAMPLE.answer)
  })

  it('formats the odd sum expression correctly', () => {
    expect(formatOddSumExpression(SUM_INSTRUCTION_EXAMPLE.digits)).toBe('3 + 5 + 7 + 9')
  })

  it('provides four plausible sum options including the answer', () => {
    expect(SUM_INSTRUCTION_EXAMPLE.options).toHaveLength(4)
    expect(SUM_INSTRUCTION_EXAMPLE.options).toContain(SUM_INSTRUCTION_EXAMPLE.answer)
  })
})
