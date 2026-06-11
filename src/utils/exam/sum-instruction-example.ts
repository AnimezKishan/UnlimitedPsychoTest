/** Fixed sum example: 36 numbers, odd digits 3+5+7+9 = 24. Answer is sum, not count. */
export const SUM_INSTRUCTION_EXAMPLE = {
  digits: [
    2, 4, 6, 8, 2, 4, 6, 8, 2, 4, 6, 8, 3, 5, 7, 9, 2, 4, 6, 8, 2, 4, 6, 8, 2, 4, 6, 8,
    2, 4, 6, 8, 2, 4, 6, 8,
  ] as const,
  options: [20, 22, 24, 26] as const,
  answer: 24,
}

export function getOddDigitIndexes(digits: ReadonlyArray<number>) {
  return new Set(
    digits.map((digit, index) => (digit % 2 === 1 ? index : -1)).filter((index) => index >= 0),
  )
}

export function sumOddDigits(digits: ReadonlyArray<number>) {
  return digits.filter((digit) => digit % 2 === 1).reduce((total, digit) => total + digit, 0)
}

export function formatOddSumExpression(digits: ReadonlyArray<number>) {
  const oddDigits = digits.filter((digit) => digit % 2 === 1)
  return oddDigits.join(' + ')
}
