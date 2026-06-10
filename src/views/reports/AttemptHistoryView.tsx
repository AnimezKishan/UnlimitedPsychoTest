import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from '#/components/common/LoadingSpinner'
import { EmptyState } from '#/components/common/EmptyState'
import { PageHeader } from '#/components/layout/PageHeader'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { getAttemptHistoryFn } from '#/server/functions/tests-functions'

export function AttemptHistoryView() {
  const historyQuery = useQuery({
    queryKey: ['attempt-history'],
    queryFn: () => getAttemptHistoryFn(),
  })

  if (historyQuery.isLoading) {
    return <LoadingSpinner label="Loading history…" />
  }

  const attempts = historyQuery.data ?? []

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Attempt history"
        description="Review your recent section attempts and scores."
      />

      {attempts.length === 0 ? (
        <EmptyState
          title="No attempts yet"
          description="Complete a section to see your history here."
          action={
            <Button asChild>
              <Link to="/sections">Browse sections</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {attempts.map((attempt) => (
            <Card key={attempt.id}>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <div>
                  <CardTitle>{attempt.section?.name ?? 'Section'}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(attempt.startedAt).toLocaleString()}
                  </p>
                </div>
                <Badge variant="secondary">{attempt.status}</Badge>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Score: <span className="font-medium text-foreground">{attempt.score ?? '—'}</span>
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/tests/results/$attemptId" params={{ attemptId: attempt.id }}>
                    View results
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
