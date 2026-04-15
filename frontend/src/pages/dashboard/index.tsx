import { useQuery } from '@tanstack/react-query'
import { getEvents } from '@shared/api/events'
import { Card } from '@shared/ui'
import { EventDashboardShell } from '@widgets/event-dashboard'

export function DashboardPage() {
  const { data: events = [] } = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: getEvents,
  })

  const featuredEvent = events[0]

  return (
    <div>
      {featuredEvent ? (
        <EventDashboardShell eventId={featuredEvent.id} showEventPicker={events.length > 1} />
      ) : (
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">No events yet</h2>
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Create your first event to unlock the organizer dashboard.
          </p>
        </Card>
      )}
    </div>
  )
}
