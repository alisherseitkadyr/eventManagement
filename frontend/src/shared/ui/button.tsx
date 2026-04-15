import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn } from '@shared/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-text)] text-white hover:bg-[color:var(--color-accent-strong)] focus-visible:outline-[var(--color-accent)]',
  secondary:
    'border border-[var(--color-border)] bg-white/70 text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] focus-visible:outline-[var(--color-accent)]',
  ghost:
    'bg-transparent text-[var(--color-text)] hover:bg-white/60 focus-visible:outline-[var(--color-accent)]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, type = 'button', variant = 'primary', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variantClassNames[variant],
        className,
      )}
      type={type}
      {...props}
    />
  )
})
