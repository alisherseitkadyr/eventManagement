import type { ReactNode } from 'react'

export type IconName =
  | 'home'
  | 'users'
  | 'edit'
  | 'eye'
  | 'send'
  | 'plus'
  | 'check'
  | 'x'
  | 'clock'
  | 'map'
  | 'calendar'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'settings'
  | 'download'
  | 'filter'
  | 'search'
  | 'bell'
  | 'link'
  | 'copy'
  | 'phone'
  | 'mail'
  | 'image'
  | 'trash'
  | 'menu'
  | 'whatsapp'
  | 'telegram'
  | 'globe'
  | 'star'
  | 'heart'
  | 'grid'
  | 'list'
  | 'move'
  | 'external-link'
  | 'file-text'
  | 'log-out'
  | 'refresh'
  | 'share'

type IconProps = {
  name: IconName
  size?: number
  color?: string
  className?: string
}

const paths: Record<IconName, ReactNode> = {
  home: (
    <>
      <rect x="3" y="10" width="7" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="14" y="10" width="7" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M2 10L12 3L22 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M19 14c2 .5 3.5 2 3.5 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.5 5.5l4 4L8 20H4v-4L14.5 5.5z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  send: (
    <>
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 2L15 22l-4-9-9-4L22 2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  check: <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  x: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  map: (
    <>
      <path d="M1 6l7-3 8 3 7-3v15l-7 3-8-3-7 3V6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="8" y1="3" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="6" x2="16" y2="21" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  'chevron-right': <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  'chevron-left': <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  'chevron-down': <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.55.2 1.16 0 1.71" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  filter: <path d="M3 4h18l-7 8v5l-4 2V12L3 4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  phone: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.65 2.36a2 2 0 01-.45 2.11L8.09 9.41a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.76.29 1.55.52 2.36.65A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" fill="none" />,
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  trash: <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />,
  menu: (
    <>
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M17.5 14.38c-.28-.14-1.65-.81-1.91-.9s-.44-.14-.63.14-.72.9-.88 1.08-.33.21-.6.07a7.54 7.54 0 01-2.22-1.37 8.3 8.3 0 01-1.54-1.91c-.16-.28 0-.43.12-.57s.28-.32.42-.49a1.9 1.9 0 00.28-.47.52.52 0 00-.02-.49c-.07-.14-.63-1.52-.86-2.08s-.46-.47-.63-.48h-.53a1.02 1.02 0 00-.74.35A3.12 3.12 0 007 10.07a5.41 5.41 0 001.14 2.88 12.42 12.42 0 004.77 4.22 15.3 15.3 0 001.59.59 3.83 3.83 0 001.76.11 2.87 2.87 0 001.88-1.33 2.33 2.33 0 00.16-1.33c-.07-.12-.25-.19-.53-.33z" fill="currentColor" />
      <path d="M20.52 3.48A11.95 11.95 0 002 12a11.87 11.87 0 001.6 5.97L2 22l4.16-1.09A11.95 11.95 0 1020.52 3.48z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  telegram: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />,
  heart: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.5" fill="none" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  list: (
    <>
      <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      <circle cx="4" cy="18" r="1" fill="currentColor" />
    </>
  ),
  move: <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  'external-link': <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  'file-text': (
    <>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  'log-out': <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  refresh: (
    <>
      <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="1.5" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
}

export function Icon({ name, size = 20, color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ color, display: 'block', flexShrink: 0 }}>
      {paths[name]}
    </svg>
  )
}
