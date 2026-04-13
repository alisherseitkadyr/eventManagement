import { Button } from '@shared/ui/button'
import { Card } from '@shared/ui/card'

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ actionLabel, description, onAction, title }: EmptyStateProps) {
  return (
    <Card className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[var(--color-text)]">{title}</h3>
        <p className="max-w-xl text-sm leading-6 text-[var(--color-muted)]">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <Button onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  )
}
