import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { LoadingSpinner } from '#/components/common/LoadingSpinner'
import { PageHeader } from '#/components/layout/PageHeader'
import { InviteUserDialog } from '#/views/users/InviteUserDialog'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { inviteUserFn, resendInvitationFn } from '#/server/functions/auth-functions'
import { listUsersFn, updateUserActiveFn } from '#/server/functions/users-functions'
import type { UserRole } from '#/lib/drizzle/schema'

export function UserManagementView() {
  const queryClient = useQueryClient()
  const [inviteOpen, setInviteOpen] = useState(false)

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => listUsersFn({ data: {} }),
  })

  const inviteMutation = useMutation({
    mutationFn: inviteUserFn,
    onSuccess: () => {
      toast.success('Invitation sent')
      setInviteOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Unable to send invitation'),
  })

  const resendMutation = useMutation({
    mutationFn: resendInvitationFn,
    onSuccess: () => toast.success('Invitation resent'),
    onError: () => toast.error('Unable to resend invitation'),
  })

  const activeMutation = useMutation({
    mutationFn: updateUserActiveFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Unable to update user status'),
  })

  if (usersQuery.isLoading) {
    return <LoadingSpinner label="Loading users…" />
  }

  const users = usersQuery.data ?? []

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="User management"
        description="Invite students, resend invitations, and manage account access."
        actions={
          <Button onClick={() => setInviteOpen(true)}>Invite user</Button>
        }
      />

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const hasPassword = user.accounts.some(
                (account) => account.providerId === 'credential' && account.password,
              )
              const pendingInvitation = user.invitations[0]

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                      {user.emailVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!user.emailVerified && !hasPassword ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={resendMutation.isPending}
                          onClick={() =>
                            resendMutation.mutate({ data: { userId: user.id } })
                          }
                        >
                          Resend
                        </Button>
                      ) : null}
                      {user.role !== 'super_admin' ? (
                        <Button
                          size="sm"
                          variant={user.isActive ? 'destructive' : 'secondary'}
                          disabled={activeMutation.isPending}
                          onClick={() =>
                            activeMutation.mutate({
                              data: { userId: user.id, isActive: !user.isActive },
                            })
                          }
                        >
                          {user.isActive ? 'Deactivate' : 'Reactivate'}
                        </Button>
                      ) : null}
                    </div>
                    {pendingInvitation ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Invitation expires {new Date(pendingInvitation.expiresAt).toLocaleString()}
                      </p>
                    ) : null}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <InviteUserDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        isSubmitting={inviteMutation.isPending}
        onSubmit={(values) => inviteMutation.mutate({ data: values })}
      />
    </div>
  )
}

function RoleBadge({ role }: { role: UserRole }) {
  const label =
    role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Student'

  return <Badge variant="outline">{label}</Badge>
}
