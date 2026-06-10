import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { AppLogo } from './AppLogo'

type AuthLayoutProps = {
  children: ReactNode
  className?: string
  eyebrow?: ReactNode
  title?: ReactNode
  description?: ReactNode
}

export function AuthLayout({
  children,
  className,
  description,
  eyebrow,
  title,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className={cn('flex w-full max-w-md flex-col gap-8', className)}>
        <div className="flex flex-col items-center gap-5 text-center">
          <AppLogo />
          <div className="flex flex-col gap-2">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            {title ? <h1 className="text-2xl font-bold tracking-tight">{title}</h1> : null}
            {description ? (
              <p className="text-sm leading-6 text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {children}
      </section>
    </main>
  )
}
