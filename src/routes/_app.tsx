import { Outlet, createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '#/components/layout/DashboardLayout'
import { Button } from '#/components/ui/button'
import { requireAuthSession } from '#/lib/route-guards'
import { authClient } from '#/lib/auth-client'
import type { UserRole } from '#/lib/drizzle/schema'

export const Route = createFileRoute('/_app')({
  beforeLoad: async () => {
    const session = await requireAuthSession()
    return {
      user: session.user,
      userRoles: [session.user.role as UserRole],
    }
  },
  component: AppLayoutRoute,
})

function AppLayoutRoute() {
  const { user, userRoles } = Route.useRouteContext()

  return (
    <DashboardLayout
      userRoles={userRoles}
      actions={
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground md:inline">{user.email}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = '/auth/login'
                  },
                },
              })
            }}
          >
            Sign out
          </Button>
        </div>
      }
    >
      <Outlet />
    </DashboardLayout>
  )
}
