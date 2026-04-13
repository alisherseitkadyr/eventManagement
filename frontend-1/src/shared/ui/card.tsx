import type { HTMLAttributes } from 'react'
import { cn } from '@shared/lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('app-panel rounded-[var(--radius-lg)] p-5 sm:p-6', className)}
      {...props}
    />
  )
}
