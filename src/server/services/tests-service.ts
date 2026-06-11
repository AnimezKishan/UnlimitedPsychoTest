import {
  getSectionTestConfig,
  ODD_NUMBER_COUNTING_CONFIG,
  ODD_NUMBER_SUM_CONFIG,
} from '#/configs/test-config'
import { generateQuestionsForSection } from '#/utils/exam/section-questions'
import { isExamTimerStarted } from '#/utils/exam/exam-timer-state'
import {
  createAttempt,
  findAttemptById,
  findAttemptsByUserId,
  findSectionBySlug,
  finalizeAttempt,
  scoreAttemptAnswers,
  seedAttemptAnswers,
  startExamTimer as startExamTimerInRepository,
  updateAttemptAnswer,
  upsertSection,
} from '#/server/repositories/tests-repository'

export async function ensureSectionsSeeded() {
  await upsertSection({
    slug: ODD_NUMBER_COUNTING_CONFIG.slug,
    name: ODD_NUMBER_COUNTING_CONFIG.name,
    description: ODD_NUMBER_COUNTING_CONFIG.description,
    questionCount: ODD_NUMBER_COUNTING_CONFIG.questionCount,
    minTimerMinutes: ODD_NUMBER_COUNTING_CONFIG.minTimerMinutes,
    maxTimerMinutes: ODD_NUMBER_COUNTING_CONFIG.maxTimerMinutes,
  })

  await upsertSection({
    slug: ODD_NUMBER_SUM_CONFIG.slug,
    name: ODD_NUMBER_SUM_CONFIG.name,
    description: ODD_NUMBER_SUM_CONFIG.description,
    questionCount: ODD_NUMBER_SUM_CONFIG.questionCount,
    minTimerMinutes: ODD_NUMBER_SUM_CONFIG.minTimerMinutes,
    maxTimerMinutes: ODD_NUMBER_SUM_CONFIG.maxTimerMinutes,
  })
}

export async function startSectionAttempt(input: {
  userId: string
  sectionSlug: string
  timerMinutes: number
}) {
  await ensureSectionsSeeded()

  const section = await findSectionBySlug(input.sectionSlug)
  const sectionConfig = getSectionTestConfig(input.sectionSlug)

  if (!section || !section.isActive || !sectionConfig) {
    throw new Error('SECTION_NOT_FOUND')
  }

  if (
    input.timerMinutes < section.minTimerMinutes ||
    input.timerMinutes > section.maxTimerMinutes
  ) {
    throw new Error('INVALID_TIMER')
  }

  const startedAt = new Date()
  const expiresAt = new Date(startedAt.getTime())

  const attempt = await createAttempt({
    userId: input.userId,
    sectionId: section.id,
    timerMinutes: input.timerMinutes,
    expiresAt,
    answers: [],
  })

  const questions = generateQuestionsForSection(input.sectionSlug, attempt.id)

  await seedAttemptAnswers(
    attempt.id,
    questions.map((question) => ({
      questionIndex: question.index,
      correctOption: String(question.correctOption),
    })),
  )

  return {
    attempt,
    section,
    questions,
  }
}

/** @deprecated Use startSectionAttempt */
export const startOddNumberAttempt = startSectionAttempt

export async function getAttemptForUser(attemptId: string, userId: string) {
  const attempt = await findAttemptById(attemptId)

  if (!attempt || attempt.userId !== userId) {
    throw new Error('ATTEMPT_NOT_FOUND')
  }

  const questions = generateQuestionsForSection(attempt.section.slug, attempt.id)

  return { attempt, questions }
}

export async function startExamTimer(input: { attemptId: string; userId: string }) {
  const { attempt } = await getAttemptForUser(input.attemptId, input.userId)

  if (attempt.status !== 'in_progress') {
    throw new Error('ATTEMPT_CLOSED')
  }

  const updated = await startExamTimerInRepository(input.attemptId)

  if (!updated) {
    throw new Error('ATTEMPT_NOT_FOUND')
  }

  return updated
}

export async function saveAttemptAnswer(input: {
  attemptId: string
  userId: string
  questionIndex: number
  selectedOption: string
}) {
  const { attempt } = await getAttemptForUser(input.attemptId, input.userId)

  if (attempt.status !== 'in_progress') {
    throw new Error('ATTEMPT_CLOSED')
  }

  if (!isExamTimerStarted(attempt)) {
    throw new Error('EXAM_NOT_STARTED')
  }

  if (new Date() > new Date(attempt.expiresAt)) {
    throw new Error('ATTEMPT_EXPIRED')
  }

  return updateAttemptAnswer({
    attemptId: input.attemptId,
    questionIndex: input.questionIndex,
    selectedOption: input.selectedOption,
  })
}

export async function submitAttempt(input: {
  attemptId: string
  userId: string
  reason?: 'manual' | 'timer'
}) {
  const { attempt } = await getAttemptForUser(input.attemptId, input.userId)

  if (attempt.status !== 'in_progress') {
    return findAttemptById(input.attemptId)
  }

  const isExpired = new Date() > new Date(attempt.expiresAt)
  const status = isExpired || input.reason === 'timer' ? 'expired' : 'submitted'
  const score = await scoreAttemptAnswers(input.attemptId)

  await finalizeAttempt({
    attemptId: input.attemptId,
    status,
    ...score,
  })

  return findAttemptById(input.attemptId)
}

export async function getAttemptHistory(userId: string) {
  return findAttemptsByUserId(userId)
}

export async function getAttemptResult(attemptId: string, userId: string) {
  const attempt = await findAttemptById(attemptId)

  if (!attempt || attempt.userId !== userId) {
    throw new Error('ATTEMPT_NOT_FOUND')
  }

  if (attempt.status === 'in_progress') {
    if (!isExamTimerStarted(attempt)) {
      return attempt
    }

    const isExpired = new Date() > new Date(attempt.expiresAt)
    if (isExpired) {
      return submitAttempt({ attemptId, userId, reason: 'timer' })
    }
  }

  return attempt
}
