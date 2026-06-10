import { useNavigate, useParams } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { LoadingSpinner } from '#/components/common/LoadingSpinner'
import { PageHeader } from '#/components/layout/PageHeader'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { useCountdown } from '#/hooks/useCountdown'
import {
  getAttemptFn,
  saveAnswerFn,
  submitAttemptFn,
} from '#/server/functions/tests-functions'
import { cn } from '#/lib/utils'
import { formatDigits } from '#/utils/odd-number-counting/generator'

export function OddNumberAttemptView() {
  const { attemptId } = useParams({ from: '/_app/sections/$slug/attempt/$attemptId' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const attemptQuery = useQuery({
    queryKey: ['attempt', attemptId],
    queryFn: () => getAttemptFn({ data: { attemptId } }),
  })

  const saveMutation = useMutation({
    mutationFn: saveAnswerFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attempt', attemptId] })
    },
  })

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      await submitAttemptFn({ data: { attemptId } })
      await navigate({
        to: '/tests/results/$attemptId',
        params: { attemptId },
      })
    } catch {
      toast.error('Unable to submit attempt')
      setIsSubmitting(false)
    }
  }, [attemptId, isSubmitting, navigate])

  const expiresAt = attemptQuery.data?.attempt.expiresAt ?? null
  const countdown = useCountdown(expiresAt, handleSubmit)

  useEffect(() => {
    if (attemptQuery.data?.attempt.status !== 'in_progress' && attemptQuery.data) {
      void navigate({
        to: '/tests/results/$attemptId',
        params: { attemptId },
      })
    }
  }, [attemptId, attemptQuery.data, navigate])

  if (attemptQuery.isLoading || !attemptQuery.data) {
    return <LoadingSpinner label="Loading attempt…" />
  }

  const { attempt, questions } = attemptQuery.data
  const question = questions[currentIndex]
  const savedAnswer = attempt.answers.find(
    (answer) => answer.questionIndex === currentIndex,
  )?.selectedOption

  async function handleSelect(option: number) {
    await saveMutation.mutateAsync({
      data: {
        attemptId,
        questionIndex: currentIndex,
        selectedOption: String(option),
      },
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title="Odd Number Counting"
        description={`Question ${currentIndex + 1} of ${questions.length}`}
        actions={
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'rounded-md border px-3 py-1.5 font-mono text-sm',
                countdown.remainingMs < 60_000 && 'border-destructive text-destructive',
              )}
              aria-live="polite"
            >
              {countdown.formatted}
            </span>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              Submit
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Count the odd digits</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="rounded-lg border bg-muted/30 px-4 py-6 text-center font-mono text-2xl tracking-[0.35em]">
            {formatDigits(question.digits)}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((option) => {
              const isSelected = savedAnswer === String(option)
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => void handleSelect(option)}
                  className={cn(
                    'rounded-lg border px-4 py-4 text-left text-lg font-medium transition-colors',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'hover:border-primary/40 hover:bg-muted/40',
                  )}
                  aria-pressed={isSelected}
                >
                  {option}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={currentIndex >= questions.length - 1}
              onClick={() =>
                setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))
              }
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
