import {
  getSectionTestConfig,
  ODD_NUMBER_COUNTING_SLUG,
  ODD_NUMBER_SUM_SLUG,
} from '#/configs/test-config'
import { generateOddNumberQuestions } from '#/utils/odd-number-counting/generator'
import { generateOddNumberSumQuestions } from '#/utils/odd-number-sum/generator'

export type SectionQuestion = {
  index: number
  digits: Array<number>
  options: Array<number>
  correctOption: number
}

export function generateQuestionsForSection(
  sectionSlug: string,
  attemptId: string,
): Array<SectionQuestion> {
  const config = getSectionTestConfig(sectionSlug)

  if (!config) {
    return []
  }

  if (sectionSlug === ODD_NUMBER_COUNTING_SLUG) {
    return generateOddNumberQuestions(
      attemptId,
      config.questionCount,
      config.minDigits,
      config.maxDigits,
    )
  }

  if (sectionSlug === ODD_NUMBER_SUM_SLUG) {
    return generateOddNumberSumQuestions(
      attemptId,
      config.questionCount,
      config.minDigits,
      config.maxDigits,
    )
  }

  return []
}
