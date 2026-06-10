import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireSuperAdmin } from '#/lib/route-guards'

export const Route = createFileRoute('/_app/admin')({
  beforeLoad: requireSuperAdmin,
  component: () => <Outlet />,
})
