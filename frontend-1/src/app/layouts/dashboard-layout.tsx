import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Outlet, useParams } from 'react-router-dom'
import { getEvents } from '@shared/api/events'
import { formatEventDate, getLocalizedText } from '@shared/lib/event-utils'
import { getEventInitials, legacyThemeVars } from '@shared/lib/legacy-theme'
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

  const currentEvent = events.find((item) => item.id === eventId) ?? events[0]
  const eventTitle = currentEvent ? getLocalizedText(currentEvent.title, 'ru') : 'Qonaq'
  const eventDate = currentEvent
    ? formatEventDate(currentEvent.stages[0]?.date ?? currentEvent.createdAt, 'ru')
    : ''

  return (
    <div className={styles.shell} style={legacyThemeVars}>
      {currentEvent ? (
        <Sidebar
          allEvents={events}
          eventDate={eventDate}
          eventId={currentEvent.id}
          eventInitials={getEventInitials(eventTitle)}
          eventName={eventTitle}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      ) : null}

      {mobileOpen && currentEvent ? (
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
