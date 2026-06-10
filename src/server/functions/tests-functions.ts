import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from '#/server/middleware/auth-middleware'
import {
  getAttemptForUser,
  getAttemptHistory,
  getAttemptResult,
  saveAttemptAnswer,
  startOddNumberAttempt,
  submitAttempt,
} from '#/server/services/tests-service'

const startAttemptSchema = z.object({
  sectionSlug: z.string().min(1),
  timerMinutes: z.number().int().min(5).max(10),
})

const attemptIdSchema = z.object({
  attemptId: z.string().uuid(),
})

const saveAnswerSchema = z.object({
  attemptId: z.string().uuid(),
  questionIndex: z.number().int().min(0).max(29),
  selectedOption: z.string().min(1),
})

export const startAttemptFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(startAttemptSchema)
  .handler(async ({ data, context }) =>
    startOddNumberAttempt({
      userId: context.user.id,
      sectionSlug: data.sectionSlug,
      timerMinutes: data.timerMinutes,
    }),
  )

export const getAttemptFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(attemptIdSchema)
  .handler(async ({ data, context }) =>
    getAttemptForUser(data.attemptId, context.user.id),
  )

export const saveAnswerFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(saveAnswerSchema)
  .handler(async ({ data, context }) =>
    saveAttemptAnswer({
      attemptId: data.attemptId,
      userId: context.user.id,
      questionIndex: data.questionIndex,
      selectedOption: data.selectedOption,
    }),
  )

export const submitAttemptFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(attemptIdSchema)
  .handler(async ({ data, context }) =>
    submitAttempt({
      attemptId: data.attemptId,
      userId: context.user.id,
      reason: 'manual',
    }),
  )

export const getAttemptResultFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(attemptIdSchema)
  .handler(async ({ data, context }) =>
    getAttemptResult(data.attemptId, context.user.id),
  )

export const getAttemptHistoryFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => getAttemptHistory(context.user.id))
