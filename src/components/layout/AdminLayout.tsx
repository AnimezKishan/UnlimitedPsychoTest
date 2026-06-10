import type { ReactNode } from 'react'

import type { UserRole } from '#/lib/drizzle/schema'

import { AppShell } from './AppShell'

type AdminLayoutProps = {
  actions?: ReactNode
  children: ReactNode
  title?: string
  userRoles?: Array<UserRole>
}

export function AdminLayout({
  actions,
  children,
  title = 'Admin Panel',
  userRoles = ['super_admin'],
}: AdminLayoutProps) {
  return (
    <AppShell actions={actions} title={title} userRoles={userRoles}>
      {children}
    </AppShell>
  )
}
