import { cn } from '@shared/lib/cn'

export type StepperItem = {
  id: string
  label: string
  description?: string
}

type StepperProps = {
  items: StepperItem[]
  currentStep: number
}

export function Stepper({ currentStep, items }: StepperProps) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {items.map((item, index) => {
        const isActive = index === currentStep
        const isComplete = index < currentStep

        return (
          <li
            className={cn(
              'rounded-[var(--radius-md)] border p-4 transition',
              isActive || isComplete
                ? 'border-[var(--color-accent)] bg-white'
                : 'border-[var(--color-border)] bg-white/50',
            )}
            key={item.id}
          >
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Step {index + 1}
            </p>
            <p className="font-medium text-[var(--color-text)]">{item.label}</p>
            {item.description ? (
              <p className="mt-1 text-sm text-[var(--color-muted)]">{item.description}</p>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
