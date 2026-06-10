import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRightIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  getNavigationForRoles,
  type NavigationGroup,
} from '#/configs/navigation-config'
import type { UserRole } from '#/lib/drizzle/schema'
import { cn } from '@/lib/utils'

import { AppLogo } from './AppLogo'

type SidebarProps = {
  collapsed?: boolean
  footer?: ReactNode
  navigation?: Array<NavigationGroup>
  userRoles?: Array<UserRole>
}

export function Sidebar({
  collapsed = false,
  footer,
  navigation,
  userRoles = [],
}: SidebarProps) {
  const location = useLocation()
  const groups = navigation ?? getNavigationForRoles(userRoles)

  return (
    <aside
      className={cn(
        'hidden min-h-screen shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col',
        collapsed ? 'w-20' : 'w-72',
      )}
    >
      <div className="flex h-16 items-center px-4">
        <AppLogo collapsed={collapsed} />
      </div>
      <Separator className="bg-sidebar-border" />
      <nav className="flex flex-1 flex-col gap-6 px-3 py-5" aria-label="Main navigation">
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-2">
            {!collapsed ? (
              <div className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                <group.icon className="size-3.5" aria-hidden="true" />
                {group.title}
              </div>
            ) : null}
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.href
                const className = cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  item.comingSoon && 'pointer-events-none cursor-not-allowed opacity-60',
                  collapsed && 'justify-center px-2',
                )
                const content = (
                  <>
                    <item.icon className="size-4" aria-hidden="true" />
                    {!collapsed ? (
                      <>
                        <span className="truncate">{item.title}</span>
                        {item.comingSoon ? (
                          <Badge variant="secondary" className="ml-auto text-[10px]">
                            Soon
                          </Badge>
                        ) : (
                          <ChevronRightIcon className="ml-auto size-4 opacity-45" aria-hidden="true" />
                        )}
                      </>
                    ) : null}
                  </>
                )

                if (item.comingSoon) {
                  return (
                    <span key={item.href} className={className} title={collapsed ? item.title : undefined}>
                      {content}
                    </span>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={className}
                    title={collapsed ? item.title : undefined}
                  >
                    {content}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      {footer ? <div className="border-t border-sidebar-border p-4">{footer}</div> : null}
    </aside>
  )
}
