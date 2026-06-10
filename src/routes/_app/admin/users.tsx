import { createFileRoute } from '@tanstack/react-router'
import { UserManagementView } from '#/views/users/UserManagementView'

export const Route = createFileRoute('/_app/admin/users')({
  component: UserManagementView,
})
