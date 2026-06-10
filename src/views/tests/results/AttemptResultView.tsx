import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from '#/components/common/LoadingSpinner'
import { PageHeader } from '#/components/layout/PageHeader'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { getAttemptResultFn } from '#/server/functions/tests-functions'

export function AttemptResultView() {
  const { attemptId } = useParams({ from: '/_app/tests/results/$attemptId' })

  const resultQuery = useQuery({
    queryKey: ['attempt-result', attemptId],
    queryFn: () => getAttemptResultFn({ data: { attemptId } }),
  })

  if (resultQuery.isLoading || !resultQuery.data) {
    return <LoadingSpinner label="Loading results…" />
  }

  const attempt = resultQuery.data
  const timeTakenMs =
    attempt.submittedAt && attempt.startedAt
      ? new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()
      : 0
  const minutes = Math.floor(timeTakenMs / 60000)
  const seconds = Math.floor((timeTakenMs % 60000) / 1000)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title="Test results"
        description={attempt.section?.name ?? 'Section summary'}
        actions={
          <Button variant="outline" asChild>
            <Link to="/sections">Back to sections</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Score summary</CardTitle>
          <Badge variant={attempt.status === 'submitted' ? 'default' : 'secondary'}>
            {attempt.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Stat label="Total score" value={String(attempt.score ?? 0)} />
            <Stat label="Correct" value={String(attempt.correctCount ?? 0)} />
            <Stat label="Incorrect" value={String(attempt.incorrectCount ?? 0)} />
            <Stat label="Unattempted" value={String(attempt.unattemptedCount ?? 0)} />
            <Stat label="Time taken" value={`${minutes}m ${seconds}s`} />
            <Stat label="Timer selected" value={`${attempt.timerMinutes} min`} />
          </dl>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild>
          <Link to="/reports">View attempt history</Link>
        </Button>
        {attempt.section ? (
          <Button variant="outline" asChild>
            <Link to="/sections/$slug/preview" params={{ slug: attempt.section.slug }}>
              Retry section
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold">{value}</dd>
    </div>
  )
}
