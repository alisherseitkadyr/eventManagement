import type { TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn } from '@shared/lib/cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 5, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[color:rgba(157,107,47,0.12)]',
        className,
      )}
      rows={rows}
      {...props}
    />
  )
})
