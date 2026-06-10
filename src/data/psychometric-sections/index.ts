import { ODD_NUMBER_COUNTING_CONFIG } from '#/configs/test-config'

export type SectionDefinition = {
  slug: string
  name: string
  description: string
  questionCount: number
  minTimerMinutes: number
  maxTimerMinutes: number
  difficulty: string
  rules: string[]
}

export const psychometricSections: Array<SectionDefinition> = [
  {
    slug: ODD_NUMBER_COUNTING_CONFIG.slug,
    name: ODD_NUMBER_COUNTING_CONFIG.name,
    description: ODD_NUMBER_COUNTING_CONFIG.description,
    questionCount: ODD_NUMBER_COUNTING_CONFIG.questionCount,
    minTimerMinutes: ODD_NUMBER_COUNTING_CONFIG.minTimerMinutes,
    maxTimerMinutes: ODD_NUMBER_COUNTING_CONFIG.maxTimerMinutes,
    difficulty: 'Foundation',
    rules: [...ODD_NUMBER_COUNTING_CONFIG.rules],
  },
]

export function getSectionBySlug(slug: string) {
  return psychometricSections.find((section) => section.slug === slug)
}
