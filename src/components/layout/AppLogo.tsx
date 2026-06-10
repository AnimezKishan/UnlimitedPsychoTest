import { cn } from '@/lib/utils'

type AppLogoProps = {
  collapsed?: boolean
  className?: string
}

export function AppLogo({ collapsed = false, className }: AppLogoProps) {
  return (
    <a
      href="/"
      className={cn(
        'inline-flex items-center rounded-md no-underline transition-opacity hover:opacity-90',
        className,
      )}
      aria-label="PsychoTest home"
    >
      <img
        src={collapsed ? '/logo.svg' : '/logo-with-text.svg'}
        alt="PsychoTest"
        className={cn(collapsed ? 'size-9' : 'h-10 w-auto')}
      />
    </a>
  )
}
