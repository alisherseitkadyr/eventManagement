type LoaderProps = {
  label?: string
}

export function Loader({ label = 'Loading...' }: LoaderProps) {
  return (
    <div className="inline-flex items-center gap-3 text-sm text-[var(--color-muted)]">
      <span className="size-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
      <span>{label}</span>
    </div>
  )
}
