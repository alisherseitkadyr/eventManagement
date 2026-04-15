import { useParams } from 'react-router-dom'
import { GuestTableShell } from '@widgets/guest-table'

export function EventGuestsPage() {
  const { eventId } = useParams()
  const resolvedEventId = eventId ?? ''

  return <GuestTableShell eventId={resolvedEventId} />
}
