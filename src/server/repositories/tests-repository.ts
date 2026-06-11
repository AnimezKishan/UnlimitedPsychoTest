import { and, desc, eq } from 'drizzle-orm'
import { db } from '#/lib/drizzle/client'
import { attemptAnswers, attempts, sections } from '#/lib/drizzle/schema'

export async function findSectionBySlug(slug: string) {
  return db.query.sections.findFirst({ where: eq(sections.slug, slug) })
}

export async function createAttempt(input: {
  userId: string
  sectionId: string
  timerMinutes: number
  expiresAt: Date
  answers: Array<{ questionIndex: number; correctOption: string }>
}) {
  const [attempt] = await db
    .insert(attempts)
    .values({
      userId: input.userId,
      sectionId: input.sectionId,
      timerMinutes: input.timerMinutes,
      expiresAt: input.expiresAt,
      status: 'in_progress',
    })
    .returning()

  if (input.answers.length > 0) {
    await db.insert(attemptAnswers).values(
      input.answers.map((answer) => ({
        attemptId: attempt.id,
        questionIndex: answer.questionIndex,
        correctOption: answer.correctOption,
      })),
    )
  }

  return attempt
}

export async function findAttemptById(id: string) {
  return db.query.attempts.findFirst({
    where: eq(attempts.id, id),
    with: {
      section: true,
      answers: {
        orderBy: (answers, { asc }) => [asc(answers.questionIndex)],
      },
    },
  })
}

export async function findAttemptsByUserId(userId: string) {
  return db.query.attempts.findMany({
    where: eq(attempts.userId, userId),
    with: { section: true },
    orderBy: desc(attempts.startedAt),
    limit: 50,
  })
}

export async function seedAttemptAnswers(
  attemptId: string,
  answers: Array<{ questionIndex: number; correctOption: string }>,
) {
  if (answers.length === 0) {
    return
  }

  await db.insert(attemptAnswers).values(
    answers.map((answer) => ({
      attemptId,
      questionIndex: answer.questionIndex,
      correctOption: answer.correctOption,
    })),
  )
}

export async function startExamTimer(attemptId: string) {
  const attempt = await findAttemptById(attemptId)

  if (!attempt) {
    return null
  }

  const timerAlreadyStarted = attempt.expiresAt.getTime() > attempt.startedAt.getTime() + 1000

  if (timerAlreadyStarted) {
    return attempt
  }

  const now = new Date()
  const expiresAt = new Date(now.getTime() + attempt.timerMinutes * 60_000)

  const [updated] = await db
    .update(attempts)
    .set({
      startedAt: now,
      expiresAt,
    })
    .where(eq(attempts.id, attemptId))
    .returning()

  return findAttemptById(updated.id)
}

export async function updateAttemptAnswer(input: {
  attemptId: string
  questionIndex: number
  selectedOption: string
}) {
  const [answer] = await db
    .update(attemptAnswers)
    .set({ selectedOption: input.selectedOption })
    .where(
      and(
        eq(attemptAnswers.attemptId, input.attemptId),
        eq(attemptAnswers.questionIndex, input.questionIndex),
      ),
    )
    .returning()

  return answer
}

export async function finalizeAttempt(input: {
  attemptId: string
  status: 'submitted' | 'expired'
  score: number
  correctCount: number
  incorrectCount: number
  unattemptedCount: number
}) {
  const [attempt] = await db
    .update(attempts)
    .set({
      status: input.status,
      submittedAt: new Date(),
      score: input.score,
      correctCount: input.correctCount,
      incorrectCount: input.incorrectCount,
      unattemptedCount: input.unattemptedCount,
    })
    .where(eq(attempts.id, input.attemptId))
    .returning()

  return attempt
}

export async function scoreAttemptAnswers(attemptId: string) {
  const answers = await db.query.attemptAnswers.findMany({
    where: eq(attemptAnswers.attemptId, attemptId),
  })

  let correctCount = 0
  let incorrectCount = 0
  let unattemptedCount = 0

  for (const answer of answers) {
    if (!answer.selectedOption) {
      unattemptedCount += 1
      await db
        .update(attemptAnswers)
        .set({ isCorrect: false })
        .where(eq(attemptAnswers.id, answer.id))
      continue
    }

    const isCorrect = answer.selectedOption === answer.correctOption
    if (isCorrect) {
      correctCount += 1
    } else {
      incorrectCount += 1
    }

    await db
      .update(attemptAnswers)
      .set({ isCorrect })
      .where(eq(attemptAnswers.id, answer.id))
  }

  return {
    score: correctCount,
    correctCount,
    incorrectCount,
    unattemptedCount,
  }
}

export async function upsertSection(input: {
  slug: string
  name: string
  description: string
  questionCount: number
  minTimerMinutes: number
  maxTimerMinutes: number
}) {
  const existing = await findSectionBySlug(input.slug)

  if (existing) {
    return existing
  }

  const [section] = await db.insert(sections).values(input).returning()
  return section
}
