import { useNavigate, useParams, useRouteContext } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { DigitSequenceExamPanel } from '#/components/exam/DigitSequenceExamPanel'
import { ExamHeader } from '#/components/exam/ExamHeader'
import { ExamTabs, type ExamTab } from '#/components/exam/ExamTabs'
import { OddNumberInstructionPanel } from '#/components/exam/OddNumberInstructionPanel'
import { OddNumberSumInstructionPanel } from '#/components/exam/OddNumberSumInstructionPanel'
import { ExamScreenSkeleton } from '#/components/common/skeletons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import {
  getSectionTestConfig,
  ODD_NUMBER_COUNTING_SLUG,
  ODD_NUMBER_SUM_SLUG,
} from '#/configs/test-config'
import { useCountdown } from '#/hooks/useCountdown'
import { useInstructionCountdown } from '#/hooks/useInstructionCountdown'
import { useFullscreen } from '#/hooks/useFullscreen'
import {
  getAttemptFn,
  saveAnswerFn,
  startExamTimerFn,
  submitAttemptFn,
} from '#/server/functions/tests-functions'
import { isExamTimerStarted } from '#/utils/exam/exam-timer-state'
import { cn } from '#/lib/utils'

export function SectionAttemptView() {
  const { slug, attemptId } = useParams({ from: '/_exam/sections/$slug/attempt/$attemptId' })
  const { user } = useRouteContext({ from: '/_exam' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const sectionConfig = getSectionTestConfig(slug)
  const fullscreen = useFullscreen()
  const fullscreenRequestedRef = useRef(false)
  const examStartRequestedRef = useRef(false)
  const closeTimeoutRef = useRef<number | null>(null)
  const [activeTab, setActiveTab] = useState<ExamTab>('instructions')
  const [skipDialogOpen, setSkipDialogOpen] = useState(false)
  const [pauseDialogOpen, setPauseDialogOpen] = useState<'pause' | 'resume' | null>(null)
  const [submissionSuccessOpen, setSubmissionSuccessOpen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStartingExam, setIsStartingExam] = useState(false)
  const [localAnswers, setLocalAnswers] = useState<Record<number, string>>({})

  const attemptQuery = useQuery({
    queryKey: ['attempt', attemptId],
    queryFn: () => getAttemptFn({ data: { attemptId } }),
  })

  const examTimerStarted = attemptQuery.data
    ? isExamTimerStarted(attemptQuery.data.attempt)
    : false

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
      toast.success('Exam submitted successfully. This window will close shortly.')
      setSubmissionSuccessOpen(true)

      closeTimeoutRef.current = window.setTimeout(() => {
        if (window.opener) {
          window.close()
          return
        }

        void navigate({
          to: '/tests/results/$attemptId',
          params: { attemptId },
        })
      }, 3000)
    } catch {
      toast.error('Unable to submit attempt')
      setIsSubmitting(false)
    }
  }, [attemptId, isSubmitting, navigate])

  const beginExam = useCallback(async () => {
    if (examStartRequestedRef.current || isStartingExam) {
      return
    }

    examStartRequestedRef.current = true
    setIsStartingExam(true)

    try {
      await startExamTimerFn({ data: { attemptId } })
      await queryClient.invalidateQueries({ queryKey: ['attempt', attemptId] })
      setActiveTab('test')
    } catch {
      examStartRequestedRef.current = false
      toast.error('Unable to start the exam timer')
    } finally {
      setIsStartingExam(false)
    }
  }, [attemptId, isStartingExam, queryClient])

  const instructionCountdown = useInstructionCountdown(() => {
    void beginExam()
  }, !attemptQuery.isLoading && !examTimerStarted)

  const expiresAt =
    examTimerStarted && attemptQuery.data ? attemptQuery.data.attempt.expiresAt : null
  const examCountdown = useCountdown(expiresAt, handleSubmit, { paused: isPaused })

  useEffect(() => {
    if (fullscreenRequestedRef.current) {
      return
    }

    fullscreenRequestedRef.current = true
    void fullscreen.enter()
  }, [fullscreen])

  useEffect(() => {
    if (examTimerStarted) {
      setActiveTab('test')
    }
  }, [examTimerStarted])

  useEffect(() => {
    if (attemptQuery.data?.attempt.status !== 'in_progress' && attemptQuery.data) {
      const resultsUrl = `/tests/results/${attemptId}`
      if (window.opener) {
        window.location.href = resultsUrl
      } else {
        void navigate({ to: '/tests/results/$attemptId', params: { attemptId } })
      }
    }
  }, [attemptId, attemptQuery.data, navigate])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!attemptQuery.data) {
      return
    }

    const saved: Record<number, string> = {}
    for (const answer of attemptQuery.data.attempt.answers) {
      if (answer.selectedOption) {
        saved[answer.questionIndex] = answer.selectedOption
      }
    }
    setLocalAnswers(saved)
  }, [attemptQuery.data])

  const answers = useMemo(() => localAnswers, [localAnswers])

  async function handleSelect(questionIndex: number, option: number) {
    if (!examTimerStarted) {
      return
    }

    const value = String(option)
    setLocalAnswers((current) => ({ ...current, [questionIndex]: value }))
    await saveMutation.mutateAsync({
      data: {
        attemptId,
        questionIndex,
        selectedOption: value,
      },
    })
  }

  function handlePauseToggleClick() {
    if (!examTimerStarted) {
      return
    }

    setPauseDialogOpen(isPaused ? 'resume' : 'pause')
  }

  if (!sectionConfig) {
    return <p className="p-6 text-sm text-muted-foreground">Section not found.</p>
  }

  if (attemptQuery.isLoading || !attemptQuery.data) {
    return <ExamScreenSkeleton />
  }

  const { attempt, questions } = attemptQuery.data
  const sectionName = attempt.section?.name ?? sectionConfig.name
  const inInstructionPhase = !examTimerStarted
  const headerCountdown = inInstructionPhase
    ? instructionCountdown.formatted
    : examCountdown.formatted
  const headerCountdownLabel = inInstructionPhase ? 'Instruction Time' : 'Time Left'
  const headerWarning = !inInstructionPhase && examCountdown.remainingMs < 60_000

  const instructionPanel =
    slug === ODD_NUMBER_SUM_SLUG ? (
      <OddNumberSumInstructionPanel timerMinutes={attempt.timerMinutes} />
    ) : slug === ODD_NUMBER_COUNTING_SLUG ? (
      <OddNumberInstructionPanel timerMinutes={attempt.timerMinutes} />
    ) : (
      <p className="p-6 text-sm text-muted-foreground">Instructions unavailable for this section.</p>
    )

  return (
    <div className={cn('flex min-h-screen flex-col bg-[#eef2f7]')}>
      <ExamHeader
        attemptLabel={`${sectionName} - 1`}
        countdown={headerCountdown}
        countdownLabel={headerCountdownLabel}
        warning={headerWarning}
        isFullscreen={fullscreen.isFullscreen}
        isPaused={isPaused}
        onToggleFullscreen={() => void fullscreen.toggle()}
        onTogglePause={examTimerStarted ? handlePauseToggleClick : undefined}
        userName={user.name}
        userEmail={user.email}
      />

      <ExamTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        testTabDisabled={inInstructionPhase}
        sectionName={sectionName}
      />

      {activeTab === 'instructions' ? (
        <>
          {instructionPanel}
          <footer className="mt-auto border-t border-[#c5d3e3] bg-[#eef2f7] px-4 py-3">
            <div className="mx-auto flex max-w-[1400px] justify-end">
              <Button
                type="button"
                className="bg-[#1e2f5f] hover:bg-[#162447]"
                onClick={() => setSkipDialogOpen(true)}
                disabled={isStartingExam}
              >
                Skip Instruction
              </Button>
            </div>
          </footer>
        </>
      ) : (
        <>
          <DigitSequenceExamPanel
            questions={questions}
            answers={answers}
            onSelect={handleSelect}
            disabled={isSubmitting || isPaused || !examTimerStarted}
          />
          <footer className="mt-auto border-t border-[#c5d3e3] bg-[#eef2f7] px-4 py-3">
            <div className="mx-auto flex max-w-[1400px] justify-end">
              <Button
                type="button"
                className="bg-[#1e2f5f] hover:bg-[#162447]"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting || !examTimerStarted}
              >
                {isSubmitting ? 'Submitting…' : 'Submit Test'}
              </Button>
            </div>
          </footer>
        </>
      )}

      <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Skip instructions?</DialogTitle>
            <DialogDescription>Are you sure you want to skip this?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              className="bg-[#1e2f5f] hover:bg-[#162447]"
              disabled={isStartingExam}
              onClick={() => {
                setSkipDialogOpen(false)
                void beginExam()
              }}
            >
              Yes
            </Button>
            <Button type="button" variant="destructive" onClick={() => setSkipDialogOpen(false)}>
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={pauseDialogOpen !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPauseDialogOpen(null)
          }
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {pauseDialogOpen === 'pause' ? 'Pause the exam?' : 'Resume the exam?'}
            </DialogTitle>
            <DialogDescription>
              {pauseDialogOpen === 'pause'
                ? 'Are you sure you want to pause? The timer will stop and answers will be disabled.'
                : 'Are you sure you want to resume? The timer will continue and you can answer again.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              className="bg-[#1e2f5f] hover:bg-[#162447]"
              onClick={() => {
                setIsPaused(pauseDialogOpen === 'pause')
                setPauseDialogOpen(null)
              }}
            >
              Yes
            </Button>
            <Button type="button" variant="destructive" onClick={() => setPauseDialogOpen(null)}>
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={submissionSuccessOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader className="items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2Icon className="size-8" aria-hidden="true" />
            </div>
            <DialogTitle>Exam submitted successfully</DialogTitle>
            <DialogDescription>
              Thank you. Your answers have been saved and this exam window will close in a few seconds.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
