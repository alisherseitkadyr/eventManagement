import { Link } from 'react-router-dom'
import { routePaths } from '@app/routes/route-paths'
import { Button, Card } from '@shared/ui'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <Card className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            404
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text)]">
            Page not found
          </h1>
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            The route you requested does not exist in this foundation.
          </p>
          <div className="flex justify-center">
            <Link to={routePaths.landing}>
              <Button variant="secondary">Back to home</Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  )
}
