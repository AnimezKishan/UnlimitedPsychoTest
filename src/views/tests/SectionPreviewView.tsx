import { Link, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '#/components/layout/PageHeader'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { getSectionTestConfig, type TimerOption } from '#/configs/test-config'
import { getSectionBySlug } from '#/data/psychometric-sections'
import { startAttemptFn } from '#/server/functions/tests-functions'
import { openExamWindow } from '#/utils/exam/open-exam-window'

export function SectionPreviewView() {
  const { slug } = useParams({ from: '/_app/sections/$slug/preview' })
  const section = getSectionBySlug(slug)
  const sectionConfig = getSectionTestConfig(slug)
  const [timerMinutes, setTimerMinutes] = useState<TimerOption>(8)
  const [isStarting, setIsStarting] = useState(false)

  if (!section || !sectionConfig) {
    return <p className="text-sm text-muted-foreground">Section not found.</p>
  }

  async function handleStart() {
    setIsStarting(true)

    try {
      const result = await startAttemptFn({
        data: { sectionSlug: slug, timerMinutes },
      })

      const attemptUrl = `${window.location.origin}/sections/${slug}/attempt/${result.attempt.id}`
      const examWindow = openExamWindow(attemptUrl)

      if (!examWindow) {
        toast.error('Pop-up blocked. Allow pop-ups to open the test in a separate window.')
        return
      }

      toast.success('Test opened in a separate window')
    } catch {
      toast.error('Unable to start the test')
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title={section.name}
        description="Review the instructions and select your timer before starting the exam."
        actions={
          <Button variant="outline" asChild>
            <Link to="/sections">Back to sections</Link>
          </Button>
        }
      />

      <Card className="overflow-hidden border-[#c5d3e3]">
        <div className="border-b bg-[#d9ebf7] px-4 py-2">
          <p className="text-sm font-medium text-[#1a2744]">General Instructions</p>
        </div>
        <CardHeader>
          <CardTitle>Before you begin</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {sectionConfig.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>

          <dl className="grid gap-3 rounded-lg border border-[#c5d3e3] bg-[#eef2f7] p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Total questions</dt>
              <dd className="font-medium">{section.questionCount}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{sectionConfig.sequenceLabel}</dt>
              <dd className="font-medium">{sectionConfig.sequenceRange}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Answer format</dt>
              <dd className="font-medium">Multiple choice (4 options)</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Exam mode</dt>
              <dd className="font-medium">
                Opens in a separate window with fullscreen support (browser dependent)
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-2">
            <label htmlFor="timer" className="text-sm font-medium">
              Select timer
            </label>
            <Select
              value={String(timerMinutes)}
              onValueChange={(value) => setTimerMinutes(Number(value) as TimerOption)}
            >
              <SelectTrigger id="timer">
                <SelectValue placeholder="Choose duration" />
              </SelectTrigger>
              <SelectContent>
                {sectionConfig.timerOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button size="lg" className="bg-[#1e2f5f] hover:bg-[#162447]" onClick={handleStart} disabled={isStarting}>
            {isStarting ? 'Starting…' : 'Start test in new window'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
