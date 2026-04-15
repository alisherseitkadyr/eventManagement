import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from 'react'

type LegacyButtonVariant = 'primary' | 'gold' | 'ghost' | 'danger' | 'sm'

type LegacyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: LegacyButtonVariant
  icon?: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const buttonBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderRadius: 999,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  transition: 'transform 200ms ease, box-shadow 200ms ease, opacity 200ms ease, background 200ms ease',
}

const buttonVariants: Record<LegacyButtonVariant, CSSProperties> = {
  primary: {
    padding: '0.75rem 1.4rem',
    background: 'var(--burgundy)',
    color: 'var(--white)',
    fontSize: 13,
    letterSpacing: '0.03em',
  },
  gold: {
    padding: '0.75rem 1.4rem',
    background: 'var(--gold)',
    color: 'var(--charcoal)',
    fontSize: 13,
    letterSpacing: '0.03em',
  },
  ghost: {
    padding: '0.7rem 1.2rem',
    border: '1.5px solid var(--sand)',
    background: 'transparent',
    color: 'var(--charcoal-soft)',
    fontSize: 13,
  },
  danger: {
    padding: '0.75rem 1.35rem',
    background: 'var(--danger)',
    color: 'var(--white)',
    fontSize: 13,
  },
  sm: {
    padding: '0.55rem 1rem',
    background: 'var(--gold-faint)',
    color: 'var(--burgundy)',
    fontSize: 12,
    fontWeight: 600,
  },
}

export function LegacyButton({
  variant = 'primary',
  icon,
  loading,
  fullWidth,
  style,
  disabled,
  children,
  ...props
}: LegacyButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      style={{
        ...buttonBaseStyle,
        ...buttonVariants[variant],
        width: fullWidth ? '100%' : undefined,
        opacity: disabled || loading ? 0.6 : 1,
        boxShadow: variant === 'ghost' ? 'none' : '0 12px 30px rgba(44, 40, 37, 0.08)',
        ...style,
      }}
      {...props}
    >
      {loading ? <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor', borderRightColor: 'transparent', display: 'inline-block' }} /> : null}
      {!loading && icon ? <span style={{ display: 'inline-flex' }}>{icon}</span> : null}
      {!loading ? children : null}
    </button>
  )
}

type LegacyCardProps = HTMLAttributes<HTMLDivElement> & {
  accentColor?: string
  noPadding?: boolean
}

export function LegacyCard({
  accentColor,
  noPadding,
  style,
  children,
  ...props
}: LegacyCardProps) {
  return (
    <div
      style={{
        background: 'var(--white)',
        borderRadius: 16,
        border: '1px solid var(--sand)',
        padding: noPadding ? 0 : '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      {accentColor ? (
        <div
          style={{
            position: 'absolute',
            inset: '0 0 auto 0',
            height: 3,
            background: accentColor,
            opacity: 0.5,
          }}
        />
      ) : null}
      {children}
    </div>
  )
}

export function LegacyBadge({
  children,
  bg,
  color,
}: {
  children: ReactNode
  bg: string
  color: string
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '0.25rem 0.7rem',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        background: bg,
        color,
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

export function LegacyToggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        background: checked ? 'var(--burgundy)' : 'var(--sand)',
        position: 'relative',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'var(--white)',
          position: 'absolute',
          top: 3,
          left: checked ? 21 : 3,
          transition: 'left 250ms cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  )
}

export function LegacyAvatar({
  name,
  size = 34,
  gradient = ['var(--ivory)', 'var(--sand)'],
}: {
  name: string
  size?: number
  gradient?: [string, string]
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 600,
        color: 'var(--burgundy)',
        flexShrink: 0,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export function LegacySectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
      }}
    >
      {children}
    </div>
  )
}

export function LegacySectionTitle({
  children,
  size = 'md',
}: {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  const fontSize = size === 'lg' ? 32 : size === 'md' ? 28 : 20

  return (
    <h2
      style={{
        fontFamily: 'var(--font-display)',
        fontSize,
        fontWeight: 300,
        color: 'var(--charcoal)',
        lineHeight: 1.2,
      }}
    >
      {children}
    </h2>
  )
}

export function LegacyEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        color: 'var(--warm-gray)',
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--charcoal)', marginBottom: 6 }}>{title}</div>
      {description ? <div style={{ fontSize: 13, marginBottom: 16 }}>{description}</div> : null}
      {action}
    </div>
  )
}
