import { Link, useNavigate, useParams } from '@tanstack/react-router'
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
import { ODD_NUMBER_COUNTING_CONFIG, type TimerOption } from '#/configs/test-config'
import { getSectionBySlug } from '#/data/psychometric-sections'
import { startAttemptFn } from '#/server/functions/tests-functions'

export function OddNumberPreviewView() {
  const { slug } = useParams({ from: '/_app/sections/$slug/preview' })
  const navigate = useNavigate()
  const section = getSectionBySlug(slug)
  const [timerMinutes, setTimerMinutes] = useState<TimerOption>(8)
  const [isStarting, setIsStarting] = useState(false)

  if (!section) {
    return <p className="text-sm text-muted-foreground">Section not found.</p>
  }

  async function handleStart() {
    setIsStarting(true)

    try {
      const result = await startAttemptFn({
        data: { sectionSlug: slug, timerMinutes },
      })

      await navigate({
        to: '/sections/$slug/attempt/$attemptId',
        params: { slug, attemptId: result.attempt.id },
      })
    } catch {
      toast.error('Unable to start the test')
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title={section.name}
        description={section.description}
        actions={
          <Button variant="outline" asChild>
            <Link to="/sections">Back to sections</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Test rules</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {ODD_NUMBER_COUNTING_CONFIG.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>

          <dl className="grid gap-3 rounded-lg border bg-muted/30 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Total questions</dt>
              <dd className="font-medium">{section.questionCount}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Answer format</dt>
              <dd className="font-medium">Multiple choice (4 options)</dd>
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
                {ODD_NUMBER_COUNTING_CONFIG.timerOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button size="lg" onClick={handleStart} disabled={isStarting}>
            {isStarting ? 'Starting…' : 'Start test'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
