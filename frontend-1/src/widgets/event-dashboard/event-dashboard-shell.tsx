import type { CSSProperties, ReactNode } from 'react'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Plus, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { routeBuilders } from '@app/routes/route-paths'
import type { Guest } from '@entities/guest'
import { rsvpStatusLabels } from '@entities/guest'
import { getEvent, getEventStats, getEvents } from '@shared/api/events'
import { getEventGuests } from '@shared/api/guests'
import { formatEventDate, getLocalizedText } from '@shared/lib/event-utils'

type EventDashboardShellProps = {
  eventId: string
  showEventPicker?: boolean
}

function pluralizeRu(value: number, one: string, few: string, many: string) {
  const mod10 = value % 10
  const mod100 = value % 100

  if (mod10 === 1 && mod100 !== 11) {
    return one
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few
  }

  return many
}

function recentResponses(guests: Guest[]) {
  return [...guests]
    .filter((guest) => guest.status !== 'pending')
    .sort((left, right) => {
      const leftDate = left.respondedAt ? Date.parse(left.respondedAt) : 0
      const rightDate = right.respondedAt ? Date.parse(right.respondedAt) : 0

      return rightDate - leftDate
    })
    .slice(0, 5)
}

function sideLabel(side: Guest['side']) {
  if (side === 'bride') return 'Невеста'
  if (side === 'groom') return 'Жених'
  return 'Общие'
}

function DashboardCard({
  children,
  accentColor,
  style,
}: {
  children: ReactNode
  accentColor?: string
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        background: 'var(--white)',
        borderRadius: 16,
        border: '1px solid var(--sand)',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {accentColor ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: accentColor,
            opacity: 0.5,
            borderRadius: '16px 16px 0 0',
          }}
        />
      ) : null}
      {children}
    </div>
  )
}

function linkButtonStyle(variant: 'primary' | 'ghost'): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '0.65rem 1.5rem',
    borderRadius: 100,
    border: variant === 'ghost' ? '1.5px solid var(--sand)' : 'none',
    background: variant === 'ghost' ? 'transparent' : 'var(--burgundy)',
    color: variant === 'ghost' ? 'var(--charcoal-soft)' : 'var(--white)',
    fontSize: 13,
    fontWeight: 500,
    textDecoration: 'none',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.03em',
  }
}

function StatusBadge({ status }: { status: Guest['status'] }) {
  const config =
    status === 'confirmed'
      ? { bg: 'var(--success-bg)', color: 'var(--success)' }
      : status === 'declined'
        ? { bg: 'var(--danger-bg)', color: 'var(--danger)' }
        : status === 'maybe'
          ? { bg: 'var(--warning-bg)', color: 'var(--warning)' }
          : { bg: 'var(--info-bg)', color: 'var(--info)' }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.7rem',
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 500,
        background: config.bg,
        color: config.color,
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
      }}
    >
      {rsvpStatusLabels[status].ru}
    </span>
  )
}

export function EventDashboardShell({
  eventId,
  showEventPicker = false,
}: EventDashboardShellProps) {
  const { data: event } = useQuery({
    queryKey: ['dashboard-event', eventId],
    queryFn: () => getEvent(eventId),
    enabled: Boolean(eventId),
  })
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', eventId],
    queryFn: () => getEventStats(eventId),
    enabled: Boolean(eventId),
  })
  const { data: guests = [] } = useQuery({
    queryKey: ['dashboard-guests', eventId],
    queryFn: () => getEventGuests(eventId),
    enabled: Boolean(eventId),
  })
  const { data: events = [] } = useQuery({
    queryKey: ['dashboard-events-picker'],
    queryFn: getEvents,
    enabled: showEventPicker,
  })

  const recent = useMemo(() => recentResponses(guests), [guests])

  if (!event || !stats) {
    return null
  }

  const total = stats.totalGuests || 1
  const replyPercent = Math.round(((stats.confirmed + stats.declined + stats.maybe) / total) * 100)
  const cards = [
    {
      label: 'Всего гостей',
      value: stats.totalGuests,
      sub: `${stats.totalPeople} ${pluralizeRu(stats.totalPeople, 'человек', 'человека', 'человек')}`,
      accent: 'var(--charcoal)',
    },
    {
      label: 'Подтвердили',
      value: stats.confirmed,
      sub: `${stats.confirmedPeople} ${pluralizeRu(stats.confirmedPeople, 'человек', 'человека', 'человек')}`,
      accent: 'var(--success)',
    },
    {
      label: 'Не ответили',
      value: stats.pending,
      sub: 'ожидают ответа',
      accent: 'var(--warning)',
    },
    {
      label: 'Отказали',
      value: stats.declined,
      sub: 'нужно перепроверить план',
      accent: 'var(--danger)',
    },
  ]

  return (
    <div
      style={{
        ['--cream' as string]: '#FAF6F1',
        ['--ivory' as string]: '#F5EDE4',
        ['--sand' as string]: '#E8DDD0',
        ['--sand-light' as string]: '#F0EAE1',
        ['--warm-gray' as string]: '#9C9186',
        ['--burgundy' as string]: '#7A2E3A',
        ['--burgundy-deep' as string]: '#5C1D29',
        ['--gold' as string]: '#C9A96E',
        ['--gold-light' as string]: '#DCC69A',
        ['--gold-faint' as string]: 'rgba(201,169,110,0.10)',
        ['--terra' as string]: '#B8674D',
        ['--charcoal' as string]: '#2C2825',
        ['--charcoal-soft' as string]: '#4A4541',
        ['--white' as string]: '#FFFFFF',
        ['--success' as string]: '#2D8A56',
        ['--success-bg' as string]: '#E8F5EE',
        ['--warning' as string]: '#D4870E',
        ['--warning-bg' as string]: '#FEF5E7',
        ['--danger' as string]: '#C0392B',
        ['--danger-bg' as string]: '#FDE8E8',
        ['--info' as string]: '#4F5FBF',
        ['--info-bg' as string]: '#EEF2FF',
        ['--font-display' as string]: '"Cormorant Garamond", serif',
        ['--font-body' as string]: '"Outfit", sans-serif',
        padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2.5rem)',
        maxWidth: 1180,
        background:
          'radial-gradient(circle at top left, rgba(201,169,110,0.14), transparent 28%), linear-gradient(180deg, var(--cream) 0%, #f8f0e8 100%)',
        borderRadius: 28,
      }}
    >
      {showEventPicker && events.length > 1 ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {events.map((candidate) => {
            const active = candidate.id === event.id
            return (
              <Link
                key={candidate.id}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: 100,
                  border: active ? '1.5px solid var(--burgundy)' : '1.5px solid var(--sand)',
                  background: active ? 'var(--burgundy)' : 'rgba(255,255,255,0.7)',
                  color: active ? 'var(--white)' : 'var(--charcoal)',
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                }}
                to={routeBuilders.eventDetails(candidate.id)}
              >
                {getLocalizedText(candidate.title, 'ru')}
              </Link>
            )
          })}
        </div>
      ) : null}

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
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 300,
              color: 'var(--charcoal)',
              lineHeight: 1.2,
            }}
          >
            {getLocalizedText(event.title, 'ru')}{' '}
            <span style={{ color: 'var(--burgundy)', fontStyle: 'italic' }}>MVP</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginTop: 6 }}>
            {formatEventDate(event.stages[0]?.date ?? event.createdAt, 'ru')} · {event.stages.length} этапа ·{' '}
            {event.stages[0]?.place ?? 'Казахстан'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link style={linkButtonStyle('ghost')} to={routeBuilders.eventSending(event.id)}>
            <Download className="size-4" />
            Экспорт
          </Link>
          <Link style={linkButtonStyle('primary')} to={routeBuilders.eventSending(event.id)}>
            <Send className="size-4" />
            Разослать
          </Link>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: '1.9rem',
        }}
      >
        {cards.map((card) => (
          <DashboardCard accentColor={card.accent} key={card.label}>
            <div
              style={{
                fontSize: 11,
                color: 'var(--warm-gray)',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 40,
                lineHeight: 1,
                fontWeight: 300,
                color: card.accent,
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 6 }}>{card.sub}</div>
          </DashboardCard>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}
      >
        <DashboardCard>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 500,
                color: 'var(--charcoal)',
              }}
            >
              Последние ответы
            </h3>
            <Link
              style={{
                color: 'var(--gold)',
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
              }}
              to={routeBuilders.eventGuests(event.id)}
            >
              Все →
            </Link>
          </div>

          <div style={{ display: 'grid', gap: 4 }}>
            {recent.map((guest) => {
              const guestWord = pluralizeRu(guest.count, 'человек', 'человека', 'человек')
              const subtitle = `${guest.count} ${guestWord} · ${sideLabel(guest.side)}`

              return (
                <div
                  key={guest.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '0.72rem 0',
                    borderBottom: '1px solid var(--sand-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--ivory), var(--sand))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--burgundy)',
                        flexShrink: 0,
                      }}
                    >
                      {guest.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: 'var(--charcoal)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {guest.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--warm-gray)' }}>{subtitle}</div>
                    </div>
                  </div>
                  <StatusBadge status={guest.status} />
                </div>
              )
            })}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 500,
              color: 'var(--charcoal)',
              marginBottom: 16,
            }}
          >
            Этапы события
          </h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {event.stages.map((stage, index) => (
              <div
                key={stage.id}
                style={{
                  display: 'flex',
                  gap: 14,
                  paddingBottom: 12,
                  borderBottom: index < event.stages.length - 1 ? '1px solid var(--sand-light)' : 'none',
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
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' }}>
                    {getLocalizedText(stage.name, 'ru')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 3 }}>
                    {formatEventDate(stage.date, 'ru')} · {stage.time}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--warm-gray)' }}>{stage.place}</div>
                </div>
              </div>
            ))}
          </div>

          <Link
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.55rem 1rem',
              borderRadius: 100,
              background: 'var(--gold-faint)',
              color: 'var(--burgundy)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
            }}
            to={routeBuilders.eventStages(event.id)}
          >
            <Plus className="size-4" />
            Добавить этап
          </Link>
        </DashboardCard>
      </div>

      <DashboardCard style={{ marginTop: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 500,
              color: 'var(--charcoal)',
            }}
          >
            Прогресс ответов
          </h3>
          <span style={{ fontSize: 13, color: 'var(--warm-gray)' }}>{replyPercent}% уже ответили</span>
        </div>

        <div
          style={{
            height: 10,
            background: 'var(--ivory)',
            borderRadius: 100,
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          {[
            { key: 'confirmed', width: (stats.confirmed / total) * 100, color: 'var(--success)' },
            { key: 'maybe', width: (stats.maybe / total) * 100, color: 'var(--warning)' },
            { key: 'declined', width: (stats.declined / total) * 100, color: 'var(--danger)' },
            { key: 'pending', width: (stats.pending / total) * 100, color: 'var(--info)' },
          ].map(({ key, width, color }) => (
            <div key={key} style={{ width: `${width}%`, background: color }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
          {[
            ['Подтвердили', 'var(--success)'],
            ['Под вопросом', 'var(--warning)'],
            ['Отказали', 'var(--danger)'],
            ['Не ответили', 'var(--info)'],
          ].map(([label, color]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: 'var(--charcoal-soft)',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: color,
                  display: 'block',
                }}
              />
              {label}
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  )
}
