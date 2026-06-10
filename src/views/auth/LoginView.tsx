import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { AuthLayout } from '#/components/layout/AuthLayout'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { authClient } from '#/lib/auth-client'

export function LoginView() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/auth/login' })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const result = await authClient.signIn.email({
      email,
      password,
    })

    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error.message ?? 'Unable to sign in')
      return
    }

    toast.success('Welcome back')
    await navigate({ to: '/sections' })
  }

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Welcome back"
      description="Use your email and password to access UnlimitedPsychoTest."
    >
      {search.error === 'inactive' ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Your account is inactive. Contact an administrator.
        </p>
      ) : null}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
        <Link to="/auth/forgot-password" className="text-primary hover:underline">
          Forgot password?
        </Link>
      </div>
    </AuthLayout>
  )
}
