export const ODD_NUMBER_COUNTING_SLUG = 'odd-number-counting'

export const ODD_NUMBER_COUNTING_CONFIG = {
  slug: ODD_NUMBER_COUNTING_SLUG,
  name: 'Odd Number Counting',
  description:
    'Count how many odd digits (1, 3, 5, 7, 9) appear in each sequence and select the correct total.',
  questionCount: 30,
  minDigits: 25,
  maxDigits: 30,
  minTimerMinutes: 5,
  maxTimerMinutes: 10,
  timerOptions: [5, 6, 7, 8, 9, 10] as const,
  rules: [
    'Each question shows a sequence of digits from 1 to 9.',
    'Each sequence contains between 25 and 30 digits.',
    'Odd digits are 1, 3, 5, 7, and 9.',
    'Select the option that matches the total count of odd digits.',
    'You can navigate between questions before submitting.',
    'The test auto-submits when the timer reaches zero.',
  ],
} as const

export type TimerOption = (typeof ODD_NUMBER_COUNTING_CONFIG.timerOptions)[number]
