import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getEvent, getEventStats } from '@shared/api/events'
import { getEventGuests } from '@shared/api/guests'
import { buildInvitationUrl, formatEventDate } from '@shared/lib/event-utils'
import { legacyPageStyle, legacyStatusStyles } from '@shared/lib/legacy-theme'
import { Icon } from '@shared/ui/icon'
import {
  LegacyAvatar,
  LegacyBadge,
  LegacyButton,
  LegacyCard,
  LegacySectionTitle,
} from '@shared/ui/legacy-ui'
import { rsvpStatusLabels } from '@entities/guest'

type EventSendingShellProps = {
  eventId: string
}

function buildShareMessage(title: string, date: string | undefined, place: string | undefined, invitationUrl: string) {
  return `Ассалаумағалейкум! 🤍

Рады пригласить вас на ${title.toLowerCase()}.

📅 ${date ?? 'Дата уточняется'}
📍 ${place ?? 'Казахстан'}

Подробности и подтверждение по ссылке:
${invitationUrl}`
}

export function EventSendingShell({ eventId }: EventSendingShellProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [messageCopied, setMessageCopied] = useState(false)

  const { data: event } = useQuery({
    queryKey: ['sending-event', eventId],
    queryFn: () => getEvent(eventId),
    enabled: Boolean(eventId),
  })
  const { data: stats } = useQuery({
    queryKey: ['sending-stats', eventId],
    queryFn: () => getEventStats(eventId),
    enabled: Boolean(eventId),
  })
  const { data: guests = [] } = useQuery({
    queryKey: ['sending-guests', eventId],
    queryFn: () => getEventGuests(eventId),
    enabled: Boolean(eventId),
  })

  if (!event || !stats) {
    return null
  }

  const hasGuests = guests.length > 0
  const pendingGuests = guests.filter((guest) => guest.status === 'pending')
  const openedCount = guests.filter((guest) => guest.openedAt).length
  const shareLink = buildInvitationUrl(guests[0]?.token ?? 'demo')
  const shareMessage = hasGuests
    ? buildShareMessage(
        event.title.ru,
        event.stages[0] ? formatEventDate(event.stages[0].date, 'ru') : undefined,
        event.stages[0]?.place,
        shareLink,
      )
    : 'Добавьте хотя бы одного гостя, чтобы получить персональную ссылку для рассылки.'

  function openShare(network: 'whatsapp' | 'telegram') {
    if (!hasGuests) {
      return
    }

    const encoded = encodeURIComponent(shareMessage)
    const url =
      network === 'whatsapp'
        ? `https://wa.me/?text=${encoded}`
        : `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encoded}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

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
            Рассылка <span style={{ fontStyle: 'italic', color: 'var(--burgundy)' }}>приглашений</span>
          </LegacySectionTitle>
          <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginTop: 6 }}>
            Отправьте персональные ссылки через мессенджеры или скопируйте готовый текст
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 24,
        }}
      >
        <LegacyCard>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, marginBottom: 16 }}>
            Быстрая отправка
          </h3>

          <div
            style={{
              background: 'var(--ivory)',
              borderRadius: 14,
              padding: '1rem',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--charcoal-soft)', marginBottom: 8 }}>
              Текст сообщения
            </div>
            <textarea
              readOnly
              value={shareMessage}
              style={{
                width: '100%',
                minHeight: 124,
                resize: 'none',
                padding: '0.8rem 0.85rem',
                borderRadius: 12,
                border: '1.5px solid var(--sand)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                lineHeight: 1.6,
                background: 'var(--white)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <LegacyButton
              variant="primary"
              style={{ flex: 1, justifyContent: 'center', background: '#25D366' }}
              disabled={!hasGuests}
              onClick={() => openShare('whatsapp')}
            >
              <Icon name="whatsapp" size={16} color="currentColor" />
              WhatsApp
            </LegacyButton>
            <LegacyButton
              variant="primary"
              style={{ flex: 1, justifyContent: 'center', background: '#0088cc' }}
              disabled={!hasGuests}
              onClick={() => openShare('telegram')}
            >
              <Icon name="telegram" size={16} color="currentColor" />
              Telegram
            </LegacyButton>
            <LegacyButton
              variant="ghost"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={!hasGuests}
              onClick={() => {
                navigator.clipboard.writeText(shareMessage)
                setMessageCopied(true)
                window.setTimeout(() => setMessageCopied(false), 1600)
              }}
            >
              <Icon name={messageCopied ? 'check' : 'copy'} size={14} color="currentColor" />
              {messageCopied ? 'Скопировано' : 'Копировать'}
            </LegacyButton>
          </div>
        </LegacyCard>

        <LegacyCard>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, marginBottom: 16 }}>
            Статистика доставки
          </h3>
          {[
            { label: 'Ссылки созданы', value: guests.length, color: 'var(--charcoal)' },
            { label: 'Открыли ссылку', value: openedCount, color: 'var(--info)' },
            { label: 'Подтвердили', value: stats.confirmed, color: 'var(--success)' },
            { label: 'Не открыли', value: guests.length - openedCount, color: 'var(--warm-gray)' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--sand-light)',
              }}
            >
              <span style={{ fontSize: 13.5, color: 'var(--charcoal-soft)' }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color }}>{value}</span>
            </div>
          ))}

          <LegacyButton
            variant="sm"
            style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
          >
            <Icon name="bell" size={14} color="currentColor" />
            Напомнить неответившим ({pendingGuests.length})
          </LegacyButton>
        </LegacyCard>
      </div>

      <LegacyCard>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 14,
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500 }}>
            Персональные ссылки
          </h3>
          <LegacyButton variant="sm">
            <Icon name="download" size={14} color="currentColor" />
            PDF всех приглашений
          </LegacyButton>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {guests.length === 0 ? (
            <div
              style={{
                padding: '1rem 0.8rem',
                borderRadius: 12,
                background: 'var(--ivory)',
                fontSize: 13,
                color: 'var(--warm-gray)',
              }}
            >
              Добавьте гостей, чтобы сгенерировать персональные ссылки для рассылки.
            </div>
          ) : (
            guests.map((guest) => (
              <div
                key={guest.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '0.7rem 0.8rem',
                  background: 'var(--ivory)',
                  borderRadius: 12,
                  flexWrap: 'wrap',
                }}
              >
                <LegacyAvatar name={guest.name} size={32} />
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--charcoal)' }}>
                    {guest.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--warm-gray)',
                      fontFamily: 'monospace',
                      marginTop: 2,
                    }}
                  >
                    {buildInvitationUrl(guest.token)}
                  </div>
                </div>
                <LegacyBadge
                  bg={legacyStatusStyles[guest.status].bg}
                  color={legacyStatusStyles[guest.status].color}
                >
                  {rsvpStatusLabels[guest.status].ru}
                </LegacyBadge>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(buildInvitationUrl(guest.token))
                    setCopiedId(guest.id)
                    window.setTimeout(() => setCopiedId(null), 1600)
                  }}
                  style={{
                    background: copiedId === guest.id ? 'var(--success-bg)' : 'var(--gold-faint)',
                    color: copiedId === guest.id ? 'var(--success)' : 'var(--burgundy)',
                    border: 'none',
                    borderRadius: 10,
                    padding: '0.45rem 0.7rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <Icon
                    name={copiedId === guest.id ? 'check' : 'copy'}
                    size={12}
                    color="currentColor"
                  />
                  {copiedId === guest.id ? 'Скопировано' : 'Копировать'}
                </button>
              </div>
            ))
          )}
        </div>
      </LegacyCard>
    </div>
  )
}
