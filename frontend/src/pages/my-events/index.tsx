import { useDeferredValue, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { routeBuilders, routePaths } from '@app/routes/route-paths'
import type { Event } from '@entities/event'
import { getEvents } from '@shared/api/events'
import { formatEventDate, getLocalizedText } from '@shared/lib/event-utils'
import { legacyBackground } from '@shared/lib/legacy-theme'
import { Button, Card, EmptyState, Input, Loader, PageHeader } from '@shared/ui'
import { Icon } from '@shared/ui/icon'

type PublicationFilter = 'all' | 'published' | 'draft'

const filters: Array<{ id: PublicationFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'draft', label: 'Drafts' },
]

function getLeadDate(event: Event) {
  return event.stages[0]?.date ?? event.createdAt
}

function matchesFilter(event: Event, filter: PublicationFilter) {
  if (filter === 'all') return true
  return filter === 'published' ? event.published : !event.published
}

export function MyEventsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<PublicationFilter>('all')
  const deferredSearch = useDeferredValue(search)

  const { data: events = [], error, isLoading } = useQuery({
    queryKey: ['my-events'],
    queryFn: getEvents,
  })

  const normalizedSearch = deferredSearch.trim().toLowerCase()
  const filteredEvents = events.filter((event) => {
    if (!matchesFilter(event, filter)) return false
    if (!normalizedSearch) return true

    const haystack = [
      getLocalizedText(event.title, 'ru'),
      getLocalizedText(event.title, 'kk'),
      event.coordinatorName,
      ...event.stages.flatMap((stage) => [stage.place, stage.address]),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedSearch)
  })

  return (
    <main
      className="min-h-screen space-y-6 p-5 md:p-8"
      style={{ background: legacyBackground, fontFamily: 'var(--font-body)' }}
    >
      <PageHeader
        eyebrow="Organizer"
        title="My invitations"
        description="Review every event, jump back into editing, and keep draft invitations moving toward publish."
        action={
          <Button onClick={() => navigate(routePaths.eventCreate)}>
            <span className="inline-flex items-center gap-2">
              <Icon name="plus" size={16} color="currentColor" />
              <span>Create invitation</span>
            </span>
          </Button>
        }
      />

      <Card className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--color-text)]">Search invitations</p>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, host, or place"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <Button
                key={item.id}
                variant={filter === item.id ? 'primary' : 'secondary'}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading ? (
        <Card className="flex min-h-40 items-center justify-center">
          <Loader label="Loading invitations..." />
        </Card>
      ) : error ? (
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">
            Invitations could not be loaded
          </h2>
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            {error instanceof Error
              ? error.message
              : 'Something went wrong while loading your events.'}
          </p>
        </Card>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title={events.length === 0 ? 'No invitations yet' : 'No invitations match these filters'}
          description={
            events.length === 0
              ? 'Create your first invitation to start customizing stages, guests, and sending flows.'
              : 'Try a different search or switch back to all invitations to see your full list again.'
          }
          actionLabel={events.length === 0 ? 'Create invitation' : 'Reset filters'}
          onAction={() => {
            if (events.length === 0) {
              navigate(routePaths.eventCreate)
              return
            }
            setSearch('')
            setFilter('all')
          }}
        />
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredEvents.map((event) => {
            const eventTitle = getLocalizedText(event.title, 'ru')
            const leadStage = event.stages[0]
            const eventDate = formatEventDate(getLeadDate(event), 'ru')

            return (
              <Card
                key={event.id}
                className="space-y-5 border border-white/60 bg-white/80 backdrop-blur"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          event.published
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {event.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="inline-flex rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
                        {event.languages.join(' / ').toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                        {eventTitle}
                      </h2>
                      <p className="text-sm text-[var(--color-muted)]">
                        Coordinator: {event.coordinatorName}
                      </p>
                    </div>
                  </div>

                  <div
                    className="h-12 w-12 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${event.accentColor}, rgba(255,255,255,0.96))`,
                    }}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[var(--color-surface-muted)] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[var(--color-muted)]">
                      <Icon name="calendar" size={16} color="currentColor" />
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">Date</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text)]">{eventDate}</p>
                  </div>

                  <div className="rounded-2xl bg-[var(--color-surface-muted)] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[var(--color-muted)]">
                      <Icon name="map" size={16} color="currentColor" />
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">Place</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {leadStage?.place ?? 'Not set yet'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[var(--color-surface-muted)] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[var(--color-muted)]">
                      <Icon name="list" size={16} color="currentColor" />
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">Stages</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {event.stages.length} {event.stages.length === 1 ? 'stage' : 'stages'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => navigate(routeBuilders.eventDetails(event.id))}>
                    Open dashboard
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(routeBuilders.eventConstructor(event.id))}
                  >
                    Continue editing
                  </Button>
                </div>
              </Card>
            )
          })}
        </section>
      )}
    </main>
  )
}
