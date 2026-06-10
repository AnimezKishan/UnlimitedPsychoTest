import { ODD_NUMBER_COUNTING_CONFIG } from '#/configs/test-config'
import { generateOddNumberQuestions } from '#/utils/odd-number-counting/generator'
import {
  createAttempt,
  findAttemptById,
  findAttemptsByUserId,
  findSectionBySlug,
  finalizeAttempt,
  scoreAttemptAnswers,
  seedAttemptAnswers,
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
}

export async function startOddNumberAttempt(input: {
  userId: string
  sectionSlug: string
  timerMinutes: number
}) {
  await ensureSectionsSeeded()

  const section = await findSectionBySlug(input.sectionSlug)

  if (!section || !section.isActive) {
    throw new Error('SECTION_NOT_FOUND')
  }

  if (
    input.timerMinutes < section.minTimerMinutes ||
    input.timerMinutes > section.maxTimerMinutes
  ) {
    throw new Error('INVALID_TIMER')
  }

  const expiresAt = new Date(Date.now() + input.timerMinutes * 60_000)

  const attempt = await createAttempt({
    userId: input.userId,
    sectionId: section.id,
    timerMinutes: input.timerMinutes,
    expiresAt,
    answers: [],
  })

  const questions = generateOddNumberQuestions(attempt.id)

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

export async function getAttemptForUser(attemptId: string, userId: string) {
  const attempt = await findAttemptById(attemptId)

  if (!attempt || attempt.userId !== userId) {
    throw new Error('ATTEMPT_NOT_FOUND')
  }

  const questions =
    attempt.section.slug === ODD_NUMBER_COUNTING_CONFIG.slug
      ? generateOddNumberQuestions(attempt.id)
      : []

  return { attempt, questions }
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
    const isExpired = new Date() > new Date(attempt.expiresAt)
    if (isExpired) {
      return submitAttempt({ attemptId, userId, reason: 'timer' })
    }
  }

  return attempt
}
