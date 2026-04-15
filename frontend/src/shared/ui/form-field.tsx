import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '@shared/lib/cn'

type FormFieldProps = PropsWithChildren<{
  label: string
  error?: string
  hint?: string
  htmlFor?: string
  action?: ReactNode
  className?: string
}>

export function FormField({
  action,
  children,
  className,
  error,
  hint,
  htmlFor,
  label,
}: FormFieldProps) {
  return (
    <label className={cn('block space-y-2', className)} htmlFor={htmlFor}>
      <span className="flex items-center justify-between gap-3 text-sm font-medium text-[var(--color-text)]">
        <span>{label}</span>
        {action}
      </span>
      {children}
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
      {!error && hint ? <span className="text-sm text-[var(--color-muted)]">{hint}</span> : null}
    </label>
  )
}
