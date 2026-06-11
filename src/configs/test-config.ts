export const ODD_NUMBER_COUNTING_SLUG = 'odd-number-counting'
export const ODD_NUMBER_SUM_SLUG = 'odd-number-sum'

export const ODD_NUMBER_COUNTING_CONFIG = {
  slug: ODD_NUMBER_COUNTING_SLUG,
  name: 'Odd Number Counting',
  description:
    'Count how many odd digits (1, 3, 5, 7, 9) appear in each sequence and select the correct total.',
  questionCount: 30,
  minDigits: 45,
  maxDigits: 50,
  minTimerMinutes: 5,
  maxTimerMinutes: 10,
  timerOptions: [5, 6, 7, 8, 9, 10] as const,
  rules: [
    'Each question shows a sequence of digits from 1 to 9.',
    'Each sequence contains between 45 and 50 digits.',
    'Odd digits are 1, 3, 5, 7, and 9.',
    'Select the option that matches the total count of odd digits.',
    'You can navigate between questions before submitting.',
    'The test auto-submits when the timer reaches zero.',
  ],
  sequenceLabel: 'Digits per question',
  sequenceRange: '45 to 50',
} as const

export const ODD_NUMBER_SUM_CONFIG = {
  slug: ODD_NUMBER_SUM_SLUG,
  name: 'Odd Number Sum',
  description:
    'Add all odd digits (1, 3, 5, 7, 9) in each sequence and select the correct total sum.',
  questionCount: 30,
  minDigits: 34,
  maxDigits: 38,
  minTimerMinutes: 5,
  maxTimerMinutes: 10,
  timerOptions: [5, 6, 7, 8, 9, 10] as const,
  rules: [
    'Each question shows a sequence of numbers from 1 to 9.',
    'Each sequence contains between 34 and 38 numbers.',
    'Odd numbers are 1, 3, 5, 7, and 9. Ignore even numbers.',
    'Select the option that matches the sum of all odd numbers in the sequence.',
    'You can navigate between questions before submitting.',
    'The test auto-submits when the timer reaches zero.',
  ],
  sequenceLabel: 'Numbers per question',
  sequenceRange: '34 to 38',
} as const

export type TimerOption = (typeof ODD_NUMBER_COUNTING_CONFIG.timerOptions)[number]

export type SectionTestConfig =
  | typeof ODD_NUMBER_COUNTING_CONFIG
  | typeof ODD_NUMBER_SUM_CONFIG

export const SECTION_CONFIGS: Record<string, SectionTestConfig> = {
  [ODD_NUMBER_COUNTING_SLUG]: ODD_NUMBER_COUNTING_CONFIG,
  [ODD_NUMBER_SUM_SLUG]: ODD_NUMBER_SUM_CONFIG,
}

export function getSectionTestConfig(slug: string) {
  return SECTION_CONFIGS[slug] ?? null
}
