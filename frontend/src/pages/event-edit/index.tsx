import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getEvent } from '@shared/api/events'
import { Card, PageHeader } from '@shared/ui'
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

export function EventEditPage() {
  const { eventId } = useParams()
  const resolvedEventId = eventId ?? ''
  const { data: event } = useQuery({
    queryKey: ['event-edit', resolvedEventId],
    queryFn: () => getEvent(resolvedEventId),
    enabled: Boolean(resolvedEventId),
  })

  if (!event) {
    return null
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="This route remains the compact event settings surface while the main organizer dashboard lives on the event overview."
        eyebrow={`Event ${eventId}`}
        title="Edit event"
      />
      <Card className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] bg-white/80 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Russian title</p>
          <p className="mt-3 text-xl font-semibold text-[var(--color-text)]">{event.title.ru}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-white/80 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Kazakh title</p>
          <p className="mt-3 text-xl font-semibold text-[var(--color-text)]">{event.title.kk}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-white/80 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Template</p>
          <p className="mt-3 text-xl font-semibold capitalize text-[var(--color-text)]">
            {event.templateStyle}
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-white/80 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Languages</p>
          <p className="mt-3 text-xl font-semibold text-[var(--color-text)]">
            {event.languages.join(', ').toUpperCase()}
          </p>
        </div>
      </Card>
    </div>
  )
}
