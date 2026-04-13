import type { ReactNode } from 'react'
import { cn } from '@shared/lib/cn'

type PageHeaderProps = {
  title: ReactNode
  description?: string
  eyebrow?: string
  action?: ReactNode
  className?: string
}

export function PageHeader({ action, className, description, eyebrow, title }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/65 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6',
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-muted)]">{description}</p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
