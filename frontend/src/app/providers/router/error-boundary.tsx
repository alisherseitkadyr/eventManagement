import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react'
import { Component } from 'react'
import { Button } from '@shared/ui/button'
import { Card } from '@shared/ui/card'

type ErrorBoundaryState = {
  hasError: boolean
}

export class AppErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error boundary caught an error', error, errorInfo)
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-4">
          <Card className="max-w-lg space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Qonaq
            </p>
            <h1 className="text-3xl font-semibold text-[var(--color-text)]">
              Something went wrong
            </h1>
            <p className="text-sm leading-6 text-[var(--color-muted)]">
              The page crashed unexpectedly. Refresh to try again and continue planning the
              invitation flow.
            </p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Reload app
            </Button>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
