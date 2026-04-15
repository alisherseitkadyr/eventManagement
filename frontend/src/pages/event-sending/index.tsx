import { useParams } from 'react-router-dom'
import { EventSendingShell } from '@widgets/event-sending'

export function EventSendingPage() {
  const { eventId } = useParams()
  const resolvedEventId = eventId ?? ''

  return <EventSendingShell eventId={resolvedEventId} />
}
