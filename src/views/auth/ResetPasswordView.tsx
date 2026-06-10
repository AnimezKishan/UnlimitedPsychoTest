import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { authClient } from '#/lib/auth-client'

export function ResetPasswordView() {
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/auth/reset-password' })
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      toast.error('Reset token is missing')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    const result = await authClient.resetPassword({
      newPassword: password,
      token,
    })

    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error.message ?? 'Unable to reset password')
      return
    }

    toast.success('Password updated')
    await navigate({ to: '/auth/login', search: {} })
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset password"
      description="Choose a new password for your account."
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={isSubmitting || !token}>
          {isSubmitting ? 'Saving…' : 'Update password'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        <Link to="/auth/login" search={{}} className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
