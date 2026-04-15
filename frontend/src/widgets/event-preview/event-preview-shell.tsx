import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { EventLanguage } from '@entities/event'
import type { Guest } from '@entities/guest'
import { getEvent } from '@shared/api/events'
import { getEventGuests } from '@shared/api/guests'
import { buildInvitationUrl, getVisibleStages } from '@shared/lib/event-utils'
import { legacyPageStyle } from '@shared/lib/legacy-theme'
import { Icon } from '@shared/ui/icon'
import { LegacyButton, LegacySectionTitle } from '@shared/ui/legacy-ui'
import { InvitationContent } from '@widgets/invitation-content'

type EventPreviewShellProps = {
  eventId: string
}

function createPreviewGuest(eventId: string): Guest {
  return {
    id: 'preview_guest',
    eventId,
    name: 'Демо-гость',
    count: 1,
    side: 'common',
    category: 'other',
    status: 'pending',
    token: 'preview',
    isVip: false,
    isElder: false,
    hasChildren: false,
    assignedStageIds: [],
  }
}

export function EventPreviewShell({ eventId }: EventPreviewShellProps) {
  const [lang, setLang] = useState<EventLanguage>('ru')
  const [copied, setCopied] = useState(false)
  const { data: event } = useQuery({
    queryKey: ['event-preview-event', eventId],
    queryFn: () => getEvent(eventId),
    enabled: Boolean(eventId),
  })
  const { data: guests = [] } = useQuery({
    queryKey: ['event-preview-guests', eventId],
    queryFn: () => getEventGuests(eventId),
    enabled: Boolean(eventId),
  })

  const previewGuest = useMemo(() => {
    if (!event) {
      return null
    }

    return guests[0] ?? createPreviewGuest(event.id)
  }, [event, guests])

  if (!event || !previewGuest) {
    return null
  }

  const visibleStages = getVisibleStages(event, previewGuest)
  const hasGuests = guests.length > 0

  return (
    <div style={legacyPageStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <LegacySectionTitle size="lg">
            Предпросмотр <span style={{ fontStyle: 'italic', color: 'var(--burgundy)' }}>приглашения</span>
          </LegacySectionTitle>
          <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginTop: 6 }}>
            {hasGuests
              ? `Так приглашение увидит гость «${previewGuest.name}»`
              : 'Так приглашение будет выглядеть до добавления гостей'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              borderRadius: 999,
              border: '1.5px solid var(--sand)',
              overflow: 'hidden',
            }}
          >
            {(['ru', 'kk'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLang(value)}
                style={{
                  padding: '0.45rem 0.9rem',
                  border: 'none',
                  background: lang === value ? 'var(--burgundy)' : 'transparent',
                  color: lang === value ? 'var(--white)' : 'var(--charcoal-soft)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {value === 'ru' ? 'Рус' : 'Қаз'}
              </button>
            ))}
          </div>

          <LegacyButton
            variant="ghost"
            disabled={!hasGuests}
            onClick={() => {
              navigator.clipboard.writeText(buildInvitationUrl(previewGuest.token))
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1500)
            }}
          >
            <Icon name={copied ? 'check' : 'copy'} size={14} color="currentColor" />
            {!hasGuests ? 'Добавьте гостя' : copied ? 'Скопировано' : 'Скопировать ссылку'}
          </LegacyButton>
        </div>
      </div>

      <div
        style={{
          width: 390,
          maxWidth: '100%',
          background: 'var(--charcoal)',
          borderRadius: 30,
          padding: '14px 14px 20px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
          marginInline: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <div
            style={{
              width: 110,
              height: 5,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
            }}
          />
        </div>
        <InvitationContent
          event={event}
          guest={previewGuest}
          visibleStages={visibleStages}
          lang={lang}
          previewMode
        />
      </div>
    </div>
  )
}
