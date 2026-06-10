import type { ReactNode } from 'react'

import type { UserRole } from '#/lib/drizzle/schema'

import { AppShell } from './AppShell'

type DashboardLayoutProps = {
  actions?: ReactNode
  children: ReactNode
  title?: string
  userRoles?: Array<UserRole>
}

export function DashboardLayout({
  actions,
  children,
  title = 'Dashboard',
  userRoles,
}: DashboardLayoutProps) {
  return (
    <AppShell actions={actions} title={title} userRoles={userRoles}>
      {children}
    </AppShell>
  )
}
