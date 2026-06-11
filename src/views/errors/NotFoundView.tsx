import { Link } from '@tanstack/react-router'
import { AppLogo } from '#/components/layout/AppLogo'
import { Button } from '#/components/ui/button'

export function NotFoundView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <AppLogo />
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            404
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
          <p className="text-sm text-muted-foreground">
            The page you requested does not exist or may have been moved.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link to="/sections">Go to Sections</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/auth/login" search={{}}>
              Sign in
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
