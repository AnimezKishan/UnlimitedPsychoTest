import { BookOpenIcon, FileTextIcon, HistoryIcon, HomeIcon, UsersIcon } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import type { UserRole } from '#/lib/drizzle/schema'

export type NavigationItem = {
  title: string
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  comingSoon?: boolean
  roles?: Array<UserRole>
}

export type NavigationGroup = {
  title: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  items: Array<NavigationItem>
}

export const navigationConfig: Array<NavigationGroup> = [
  {
    title: 'Home',
    icon: HomeIcon,
    items: [
      {
        title: 'Sections',
        href: '/sections',
        icon: BookOpenIcon,
      },
      {
        title: 'Full-Paper',
        href: '/full-paper',
        icon: FileTextIcon,
        comingSoon: true,
      },
      {
        title: 'Attempt History',
        href: '/reports',
        icon: HistoryIcon,
      },
    ],
  },
  {
    title: 'Admin Panel',
    icon: UsersIcon,
    items: [
      {
        title: 'User Management',
        href: '/admin/users',
        icon: UsersIcon,
        roles: ['super_admin'],
      },
    ],
  },
]

export function hasRole(userRoles: Array<UserRole> | undefined, role: UserRole) {
  return Boolean(userRoles?.includes(role))
}

export function canAccessNavigationItem(
  item: NavigationItem,
  userRoles: Array<UserRole> = [],
) {
  return !item.roles || item.roles.some((role) => hasRole(userRoles, role))
}

export function canAccessNavigationGroup(
  group: NavigationGroup,
  userRoles: Array<UserRole> = [],
) {
  return group.items.some((item) => canAccessNavigationItem(item, userRoles))
}

export function getNavigationForRoles(userRoles: Array<UserRole> = []) {
  return navigationConfig
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessNavigationItem(item, userRoles)),
    }))
    .filter((group) => group.items.length > 0)
}
