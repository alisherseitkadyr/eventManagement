import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { routePaths } from '@app/routes/route-paths'
import { SignInForm } from '@features/auth-sign-in'
import { SignUpForm } from '@features/auth-sign-up'

function AuthShell({
  children,
  subtitle,
  title,
}: {
  children: ReactNode
  title: string
  subtitle: string
}) {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4 rounded-[2rem] bg-[var(--color-text)] p-8 text-white">
          <Link
            className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60"
            to={routePaths.landing}
          >
            Qonaq
          </Link>
          <h1 className="max-w-sm text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-md text-sm leading-6 text-white/70">{subtitle}</p>
        </div>
        <div>{children}</div>
      </div>
    </section>
  )
}

export function SignInPage() {
  return (
    <AuthShell
      subtitle="Protected routes, query provider, and i18n are already active so you can start integrating product logic safely."
      title="Sign in to manage invitation flows"
    >
      <SignInForm />
    </AuthShell>
  )
}

export function SignUpPage() {
  return (
    <AuthShell
      subtitle="Create the first workspace account shell and move into event creation without adding business complexity."
      title="Open a new organizer workspace"
    >
      <SignUpForm />
    </AuthShell>
  )
}
