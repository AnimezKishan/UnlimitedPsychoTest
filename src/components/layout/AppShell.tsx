import type { ReactNode } from 'react'

import type { NavigationGroup } from '#/configs/navigation-config'
import type { UserRole } from '#/lib/drizzle/schema'
import { cn } from '@/lib/utils'

import { HeaderBar } from './HeaderBar'
import { Sidebar } from './Sidebar'

type AppShellProps = {
  actions?: ReactNode
  children: ReactNode
  className?: string
  navigation?: Array<NavigationGroup>
  sidebarCollapsed?: boolean
  sidebarFooter?: ReactNode
  title?: string
  userRoles?: Array<UserRole>
}

export function AppShell({
  actions,
  children,
  className,
  navigation,
  sidebarCollapsed,
  sidebarFooter,
  title,
  userRoles,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          footer={sidebarFooter}
          navigation={navigation}
          userRoles={userRoles}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <HeaderBar actions={actions} title={title} />
          <main className={cn('flex-1 px-4 py-6 lg:px-8', className)}>{children}</main>
        </div>
      </div>
    </div>
  )
}
