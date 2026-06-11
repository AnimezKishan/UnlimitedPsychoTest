import { Maximize2Icon, Minimize2Icon, PauseIcon, UserIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

type ExamHeaderProps = {
  attemptLabel: string
  countdown: string
  countdownLabel?: string
  isFullscreen: boolean
  isPaused?: boolean
  onToggleFullscreen: () => void
  onTogglePause?: () => void
  userEmail?: string
  userName?: string
  warning?: boolean
}

export function ExamHeader({
  attemptLabel,
  countdown,
  countdownLabel = 'Time Left',
  isFullscreen,
  isPaused,
  onToggleFullscreen,
  onTogglePause,
  userEmail,
  userName,
  warning,
}: ExamHeaderProps) {
  return (
    <header className="border-b border-[#c5d3e3] bg-white">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="size-8" aria-hidden="true" />
          <p className="text-sm font-semibold text-[#1a2744] sm:text-base">{attemptLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className={cn(
              'rounded border border-[#8fa3bc] bg-white px-3 py-1.5 text-sm font-semibold tabular-nums',
              warning && 'border-destructive text-destructive',
            )}
            aria-live="polite"
          >
            {countdownLabel} {countdown}
          </div>
          {onTogglePause ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-[#8fa3bc] bg-white"
              onClick={onTogglePause}
            >
              <PauseIcon className="size-4" />
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-[#8fa3bc] bg-white"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2Icon className="size-4" />
            ) : (
              <Maximize2Icon className="size-4" />
            )}
            Switch Fullscreen
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#1a2744] sm:text-sm">
          <div className="flex items-center gap-1.5">
            <UserIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="font-medium">{userName ?? 'Student'}</span>
          </div>
          {userEmail ? (
            <div className="hidden items-center gap-1.5 sm:flex">
              <UserIcon className="size-4 text-muted-foreground" aria-hidden="true" />
              <span>{userEmail}</span>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
