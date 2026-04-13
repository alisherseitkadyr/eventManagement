import { useDeferredValue, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { RsvpStatus } from '@entities/guest'
import { getEventGuests } from '@shared/api/guests'
import { buildInvitationUrl } from '@shared/lib/event-utils'
import { legacyPageStyle } from '@shared/lib/legacy-theme'
import { LegacySectionTitle } from '@shared/ui/legacy-ui'
import { GuestFilters } from '@widgets/guest-table/guest-filters'
import { GuestTable } from '@widgets/guest-table/guest-table'

type GuestTableShellProps = {
  eventId: string
}

export function GuestTableShell({ eventId }: GuestTableShellProps) {
  const [filter, setFilter] = useState<RsvpStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const deferredSearch = useDeferredValue(search)

  const { data: guests = [] } = useQuery({
    queryKey: ['event-guests', eventId, filter, deferredSearch],
    queryFn: () =>
      getEventGuests(eventId, {
        status: filter === 'all' ? undefined : filter,
        search: deferredSearch || undefined,
      }),
  })

  return (
    <div style={legacyPageStyle}>
      <LegacySectionTitle>Гостевая база</LegacySectionTitle>
      <div style={{ marginTop: 12 }}>
        <GuestFilters
          activeStatus={filter}
          onStatusChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <GuestTable
          copiedId={copiedId}
          guests={guests}
          onCopyLink={(guest) => {
            navigator.clipboard.writeText(buildInvitationUrl(guest.token))
            setCopiedId(guest.id)
            window.setTimeout(() => setCopiedId(null), 2000)
          }}
          onRemind={(guest) => {
            console.info('remind', guest.id)
          }}
        />
      </div>
    </div>
  )
}
