import { useParams } from 'react-router-dom'
import { EventConstructorShell } from '@widgets/event-constructor'

export function EventConstructorPage() {
  const { eventId } = useParams()
  const resolvedEventId = eventId ?? ''

  return <EventConstructorShell eventId={resolvedEventId} />
}
