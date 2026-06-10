import { LoaderCircleIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type LoadingSpinnerProps = {
  className?: string
  label?: string
}

export function LoadingSpinner({ className, label = 'Loading' }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2 text-muted-foreground', className)}>
      <LoaderCircleIcon className="size-5 animate-spin" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
