import { describe, expect, it } from 'vitest'
import {
  COUNTING_INSTRUCTION_EXAMPLE,
  countOddDigits,
  getOddDigitIndexes,
} from '#/utils/exam/counting-instruction-example'

describe('counting instruction example', () => {
  it('uses 45 to 50 digits', () => {
    expect(COUNTING_INSTRUCTION_EXAMPLE.digits.length).toBeGreaterThanOrEqual(45)
    expect(COUNTING_INSTRUCTION_EXAMPLE.digits.length).toBeLessThanOrEqual(50)
  })

  it('matches answer to the count of odd digits', () => {
    const oddCount = countOddDigits(COUNTING_INSTRUCTION_EXAMPLE.digits)
    expect(oddCount).toBe(COUNTING_INSTRUCTION_EXAMPLE.answer)
    expect(getOddDigitIndexes(COUNTING_INSTRUCTION_EXAMPLE.digits).size).toBe(oddCount)
  })

  it('provides four plausible count options including the answer', () => {
    expect(COUNTING_INSTRUCTION_EXAMPLE.options).toHaveLength(4)
    expect(COUNTING_INSTRUCTION_EXAMPLE.options).toContain(COUNTING_INSTRUCTION_EXAMPLE.answer)
  })
})
