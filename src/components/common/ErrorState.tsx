import { CircleAlertIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ErrorStateProps = {
  action?: ReactNode
  className?: string
  description?: ReactNode
  onRetry?: () => void
  title?: ReactNode
}

export function ErrorState({
  action,
  className,
  description = 'Something went wrong. Please try again.',
  onRetry,
  title = 'Unable to load this content',
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-64 flex-col items-center justify-center gap-4 rounded-xl border bg-card px-6 py-10 text-center',
        className,
      )}
      role="alert"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <CircleAlertIcon className="size-5" aria-hidden="true" />
      </div>
      <div className="flex max-w-sm flex-col gap-1">
        <h2 className="text-base font-semibold text-card-foreground">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ??
        (onRetry ? (
          <Button type="button" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        ) : null)}
    </div>
  )
}
