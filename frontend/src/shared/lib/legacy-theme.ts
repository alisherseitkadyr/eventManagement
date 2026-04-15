import type { CSSProperties } from 'react'
import type { RsvpStatus } from '@entities/guest'

export const legacyThemeVars: CSSProperties = {
  ['--cream' as string]: '#FAF6F1',
  ['--ivory' as string]: '#F5EDE4',
  ['--sand' as string]: '#E8DDD0',
  ['--sand-light' as string]: '#F0EAE1',
  ['--warm-gray' as string]: '#9C9186',
  ['--burgundy' as string]: '#7A2E3A',
  ['--burgundy-deep' as string]: '#5C1D29',
  ['--burgundy-light' as string]: 'rgba(122,46,58,0.08)',
  ['--gold' as string]: '#C9A96E',
  ['--gold-light' as string]: '#DCC69A',
  ['--gold-faint' as string]: 'rgba(201,169,110,0.10)',
  ['--terra' as string]: '#B8674D',
  ['--charcoal' as string]: '#2C2825',
  ['--charcoal-soft' as string]: '#4A4541',
  ['--white' as string]: '#FFFFFF',
  ['--success' as string]: '#2D8A56',
  ['--success-bg' as string]: '#E8F5EE',
  ['--warning' as string]: '#D4870E',
  ['--warning-bg' as string]: '#FEF5E7',
  ['--danger' as string]: '#C0392B',
  ['--danger-bg' as string]: '#FDE8E8',
  ['--info' as string]: '#4F5FBF',
  ['--info-bg' as string]: '#EEF2FF',
  ['--font-display' as string]: '"Cormorant Garamond", serif',
  ['--font-body' as string]: '"Outfit", sans-serif',
}

export const legacyBackground =
  'radial-gradient(circle at top left, rgba(201,169,110,0.14), transparent 28%), linear-gradient(180deg, var(--cream) 0%, #f8f0e8 100%)'

export const legacyPageStyle: CSSProperties = {
  padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2.5rem)',
  maxWidth: 1180,
  width: '100%',
}

export const legacyStatusStyles: Record<RsvpStatus, { bg: string; color: string }> = {
  confirmed: { bg: 'var(--success-bg)', color: 'var(--success)' },
  declined: { bg: 'var(--danger-bg)', color: 'var(--danger)' },
  maybe: { bg: 'var(--warning-bg)', color: 'var(--warning)' },
  pending: { bg: 'var(--info-bg)', color: 'var(--info)' },
}

export function pluralizeRu(value: number, one: string, few: string, many: string) {
  const mod10 = value % 10
  const mod100 = value % 100

  if (mod10 === 1 && mod100 !== 11) {
    return one
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few
  }

  return many
}

export function getEventInitials(title: string) {
  const compact = title
    .replace(/свадьба|той|приглашение/gi, '')
    .replace(/[^\p{L}\s&]/gu, ' ')
    .split(/[&\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return compact || title.slice(0, 2).toUpperCase()
}
