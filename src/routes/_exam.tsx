import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireAuthSession } from '#/lib/route-guards'

export const Route = createFileRoute('/_exam')({
  beforeLoad: async () => {
    const session = await requireAuthSession()
    return { user: session.user }
  },
  component: () => <Outlet />,
})
