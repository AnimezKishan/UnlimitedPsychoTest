import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { PageHeader } from '#/components/layout/PageHeader'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { psychometricSections } from '#/data/psychometric-sections'

export function SectionsListView() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Sections"
        description="Practice focused psychometric sections. Start with Odd Number Counting."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {psychometricSections.map((section) => (
          <SectionCard key={section.slug} section={section} />
        ))}
      </div>
    </div>
  )
}

function SectionCard({ section }: { section: (typeof psychometricSections)[number] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{section.name}</CardTitle>
            <CardDescription className="mt-2">{section.description}</CardDescription>
          </div>
          <Badge variant="secondary">{section.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-4">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Questions</dt>
            <dd className="font-medium">{section.questionCount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Timer</dt>
            <dd className="font-medium">
              {section.minTimerMinutes}–{section.maxTimerMinutes} min
            </dd>
          </div>
        </dl>
        <Button asChild>
          <Link to="/sections/$slug/preview" params={{ slug: section.slug }}>
            Start
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
