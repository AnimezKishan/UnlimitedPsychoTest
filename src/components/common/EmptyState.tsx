import { InboxIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type EmptyStateProps = {
  action?: ReactNode
  className?: string
  description?: ReactNode
  icon?: ReactNode
  title?: ReactNode
}

export function EmptyState({
  action,
  className,
  description = 'There is nothing to show here yet.',
  icon,
  title = 'No results found',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-64 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-card px-6 py-10 text-center',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <InboxIcon className="size-5" aria-hidden="true" />}
      </div>
      <div className="flex max-w-sm flex-col gap-1">
        <h2 className="text-base font-semibold text-card-foreground">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="flex items-center justify-center gap-2">{action}</div> : null}
    </div>
  )
}
