import { useParams } from 'react-router-dom'
import { EventDashboardShell } from '@widgets/event-dashboard'

export function EventDetailsPage() {
  const { eventId } = useParams()
  const resolvedEventId = eventId ?? ''

  return (
    <div className="space-y-6">
      <EventDashboardShell eventId={resolvedEventId} />
    </div>
  )
}
