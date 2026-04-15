import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Outlet, useParams } from 'react-router-dom'
import { getEvents } from '@shared/api/events'
import { formatEventDate, getLocalizedText } from '@shared/lib/event-utils'
import { legacyThemeVars } from '@shared/lib/legacy-theme'
import { Icon } from '@shared/ui/icon'
import { Sidebar } from '@widgets/sidebar'
import styles from '@app/layouts/dashboard-layout.module.css'

export function DashboardLayout() {
  const { eventId } = useParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: events = [] } = useQuery({
    queryKey: ['organizer-events'],
    queryFn: getEvents,
  })

  const currentEvent = events.find((item) => item.id === eventId)
  const eventTitle = currentEvent ? getLocalizedText(currentEvent.title, 'ru') : ''
  const eventDate = currentEvent
    ? formatEventDate(currentEvent.stages[0]?.date ?? currentEvent.createdAt, 'ru')
    : ''

  return (
    <div className={styles.shell} style={legacyThemeVars}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {mobileOpen ? (
        <button
          type="button"
          className={styles.overlay}
          aria-label="Закрыть меню"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className={styles.mainArea}>
        {currentEvent ? (
          <div className={styles.mobileBar}>
            <button
              type="button"
              className={styles.mobileMenuButton}
              aria-label="Открыть меню"
              onClick={() => setMobileOpen(true)}
            >
              <Icon name="menu" size={20} color="currentColor" />
            </button>
            <div className={styles.mobileEventMeta}>
              <div className={styles.mobileEventTitle}>{eventTitle}</div>
              <div className={styles.mobileEventDate}>{eventDate}</div>
            </div>
          </div>
        ) : null}

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
