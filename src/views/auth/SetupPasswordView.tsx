import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { authClient } from '#/lib/auth-client'
import { setupPasswordFn } from '#/server/functions/auth-functions'

export function SetupPasswordView() {
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/auth/setup-password' })
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      toast.error('Invitation token is missing')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await setupPasswordFn({ data: { token, password } })
      const signIn = await authClient.signIn.email({
        email: result.email,
        password,
      })

      if (signIn.error) {
        toast.success('Password created. Please sign in.')
        await navigate({ to: '/auth/login', search: {} })
        return
      }

      toast.success('Account ready')
      await navigate({ to: '/sections' })
    } catch {
      toast.error('Invalid or expired invitation link')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Invitation"
      title="Create your password"
      description="Set a secure password to activate your UnlimitedPsychoTest account."
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
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
          {isSubmitting ? 'Saving…' : 'Create password'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have a password?{' '}
        <Link to="/auth/login" search={{}} className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
