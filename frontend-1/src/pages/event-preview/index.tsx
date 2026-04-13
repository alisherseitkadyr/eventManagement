import { useParams } from 'react-router-dom'
import { EventPreviewShell } from '@widgets/event-preview'

export function EventPreviewPage() {
  const { eventId } = useParams()
  const resolvedEventId = eventId ?? ''

  return <EventPreviewShell eventId={resolvedEventId} />
}
