import type { PropsWithChildren } from 'react'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { LanguageSwitcher } from '@widgets/language-switcher'
import { routePaths } from '@app/routes/route-paths'

function PublicLayoutFrame({ children }: PropsWithChildren) {
  const location = useLocation()
  const showFloatingLanguageSwitcher =
    location.pathname !== routePaths.landing &&
    !location.pathname.startsWith('/invite/')

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text)]">
      {showFloatingLanguageSwitcher ? (
        <div className="pointer-events-none fixed right-4 top-4 z-50 sm:right-6 sm:top-6 lg:right-8">
          <div className="pointer-events-auto">
            <LanguageSwitcher />
          </div>
        </div>
      ) : null}
      {children}
    </div>
  )
}

export function PublicLayout() {
  return (
    <PublicLayoutFrame>
      <Outlet />
    </PublicLayoutFrame>
  )
}
