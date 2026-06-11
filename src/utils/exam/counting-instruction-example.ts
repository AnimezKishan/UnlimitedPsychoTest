/** Fixed counting example: 48 digits with exactly 11 odd digits. Answer is count, not sum. */
export const COUNTING_INSTRUCTION_EXAMPLE = {
  digits: [
    2, 4, 6, 8, 2, 4, 6, 8, 2, 4, 6, 8, 1, 3, 5, 7, 9, 2, 4, 6, 8, 2, 4, 6, 8,
    1, 3, 2, 4, 6, 8, 2, 4, 6, 8, 5, 7, 9, 2, 4, 6, 8, 2, 4, 6, 8, 1, 2,
  ] as const,
  options: [9, 10, 11, 12] as const,
  answer: 11,
}

export function getOddDigitIndexes(digits: ReadonlyArray<number>) {
  return new Set(
    digits.map((digit, index) => (digit % 2 === 1 ? index : -1)).filter((index) => index >= 0),
  )
}

export function countOddDigits(digits: ReadonlyArray<number>) {
  return digits.filter((digit) => digit % 2 === 1).length
}
