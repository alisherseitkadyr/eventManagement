import { useCallback, useEffect, useState } from 'react'

export type SidebarMode = 'full' | 'rail'

const STORAGE_KEY = 'qonaq-sidebar-mode'

function readStoredMode(): SidebarMode | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'full' || v === 'rail') return v as SidebarMode
  } catch {}
  return null
}

function getInitialMode(): SidebarMode {
  const stored = readStoredMode()
  if (stored) return stored
  return typeof window !== 'undefined' && window.innerWidth < 1024 ? 'rail' : 'full'
}

export type UseSidebarReturn = {
  mode: SidebarMode
  toggle: () => void
  mobileOpen: boolean
  openMobile: () => void
  closeMobile: () => void
}

export function useSidebar(): UseSidebarReturn {
  const [mode, setMode] = useState<SidebarMode>(getInitialMode)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next: SidebarMode = prev === 'full' ? 'rail' : 'full'
      try { localStorage.setItem(STORAGE_KEY, next) } catch {}
      return next
    })
  }, [])

  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)')
    const handle = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false)
    }
    media.addEventListener('change', handle)
    return () => media.removeEventListener('change', handle)
  }, [])

  return { mode, toggle, mobileOpen, openMobile, closeMobile }
}
