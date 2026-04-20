import { useQuery } from '@tanstack/react-query'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { getEvents } from '@shared/api/events'
import { formatEventDate, getLocalizedText } from '@shared/lib/event-utils'
import { legacyThemeVars } from '@shared/lib/legacy-theme'
import { Icon } from '@shared/ui/icon'
import { Sidebar, useSidebar } from '@widgets/sidebar'
import styles from '@app/layouts/dashboard-layout.module.css'

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/templates')) return 'Templates'
  if (pathname.startsWith('/my-events')) return 'My Invitations'
  if (pathname.startsWith('/events/new')) return 'Create Invitation'
  return ''
}

export function DashboardLayout() {
  const { eventId } = useParams()
  const { pathname } = useLocation()
  const { mode, toggle, mobileOpen, openMobile, closeMobile } = useSidebar()

  const { data: events = [] } = useQuery({
    queryKey: ['organizer-events'],
    queryFn: getEvents,
    enabled: Boolean(eventId),
  })

  const currentEvent = events.find((item) => item.id === eventId)
  const mobileTitle = currentEvent
    ? getLocalizedText(currentEvent.title, 'ru')
    : getPageTitle(pathname)
  const mobileDate = currentEvent
    ? formatEventDate(currentEvent.stages[0]?.date ?? currentEvent.createdAt, 'ru')
    : null

  return (
    <div
      className={`${styles.shell} ${mode === 'rail' ? styles.shellRail : ''}`}
      style={legacyThemeVars}
    >
      <Sidebar
        mode={mode}
        onToggle={toggle}
        eventId={eventId ?? null}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />

      {mobileOpen ? (
        <button
          type="button"
          className={styles.overlay}
          aria-label="Close menu"
          onClick={closeMobile}
        />
      ) : null}

      <div className={`${styles.mainArea} ${mode === 'rail' ? styles.mainAreaRail : ''}`}>
        <div className={styles.mobileBar}>
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-label="Open menu"
            onClick={openMobile}
          >
            <Icon name="menu" size={20} color="currentColor" />
          </button>
          <div className={styles.mobileEventMeta}>
            <div className={styles.mobileEventTitle}>{mobileTitle}</div>
            {mobileDate && (
              <div className={styles.mobileEventDate}>{mobileDate}</div>
            )}
          </div>
        </div>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
