import { MenuIcon, SearchIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { AppLogo } from './AppLogo'

type HeaderBarProps = {
  actions?: ReactNode
  className?: string
  onMenuClick?: () => void
  title?: string
}

export function HeaderBar({ actions, className, onMenuClick, title }: HeaderBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 lg:px-6',
        className,
      )}
    >
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <MenuIcon />
        <span className="sr-only">Open navigation</span>
      </Button>
      <div className="flex items-center gap-3 lg:hidden">
        <AppLogo collapsed />
      </div>
      {title ? <h1 className="truncate text-sm font-semibold lg:text-base">{title}</h1> : null}
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground md:flex">
          <SearchIcon className="size-4" aria-hidden="true" />
          Search PsychoTest
        </div>
        {actions}
      </div>
    </header>
  )
}
