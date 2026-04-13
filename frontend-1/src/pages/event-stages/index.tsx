import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getEvent } from '@shared/api/events'
import { formatEventDate, getLocalizedText } from '@shared/lib/event-utils'
import { legacyPageStyle } from '@shared/lib/legacy-theme'
import { LegacyCard, LegacySectionTitle } from '@shared/ui/legacy-ui'

export function EventStagesPage() {
  const { eventId } = useParams()
  const resolvedEventId = eventId ?? ''
  const { data: event } = useQuery({
    queryKey: ['event-stages', resolvedEventId],
    queryFn: () => getEvent(resolvedEventId),
    enabled: Boolean(resolvedEventId),
  })

  if (!event) {
    return null
  }

  return (
    <div style={legacyPageStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <LegacySectionTitle size="lg">Этапы события</LegacySectionTitle>
        <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginTop: 6 }}>
          Полный список сценария и площадок
        </p>
      </div>

      <LegacyCard>
        {event.stages.map((stage, index) => (
          <div
            key={stage.id}
            style={{
              display: 'flex',
              gap: 14,
              paddingBottom: 12,
              borderBottom: index < event.stages.length - 1 ? '1px solid var(--sand-light)' : 'none',
              marginBottom: index < event.stages.length - 1 ? 12 : 0,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background:
                  index % 3 === 0
                    ? 'linear-gradient(135deg, var(--burgundy), var(--burgundy-deep))'
                    : index % 3 === 1
                      ? 'linear-gradient(135deg, var(--gold), var(--terra))'
                      : 'linear-gradient(135deg, var(--terra), var(--burgundy))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {stage.emoji ?? '✨'}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' }}>
                {getLocalizedText(stage.name, 'ru')}
              </p>
              <p style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 3 }}>
                {formatEventDate(stage.date, 'ru')} · {stage.time}
              </p>
              <p style={{ fontSize: 12, color: 'var(--warm-gray)' }}>{stage.place}</p>
              <p style={{ fontSize: 12, color: 'var(--warm-gray)' }}>{stage.address}</p>
            </div>
          </div>
        ))}
      </LegacyCard>
    </div>
  )
}
