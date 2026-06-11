import { createFileRoute } from '@tanstack/react-router'
import { PageHeaderSkeleton, TableSkeleton } from '#/components/common/skeletons'
import { UserManagementView } from '#/views/users/UserManagementView'

function AdminUsersPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeaderSkeleton />
      <TableSkeleton rows={6} />
    </div>
  )
}

export const Route = createFileRoute('/_app/admin/users')({
  pendingComponent: AdminUsersPageSkeleton,
  component: UserManagementView,
})
