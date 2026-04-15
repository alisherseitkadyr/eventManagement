import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { EventLanguage, TemplateStyle } from '@entities/event'
import { getEvent } from '@shared/api/events'
import { getEventGuests } from '@shared/api/guests'
import { formatEventDate, getLocalizedText, getVisibleStages } from '@shared/lib/event-utils'
import { legacyPageStyle } from '@shared/lib/legacy-theme'
import {
  LegacyCard,
  LegacySectionLabel,
  LegacySectionTitle,
  LegacyToggle,
} from '@shared/ui/legacy-ui'
import { Icon } from '@shared/ui/icon'

type ConstructorBlockId =
  | 'cover'
  | 'names'
  | 'countdown'
  | 'story'
  | 'program'
  | 'map'
  | 'dresscode'
  | 'gallery'
  | 'rsvp'
  | 'contacts'

type ConstructorBlock = {
  id: ConstructorBlockId
  label: string
  icon: string
  enabled: boolean
}

const defaultBlocks: ConstructorBlock[] = [
  { id: 'cover', label: 'Обложка', icon: '🖼', enabled: true },
  { id: 'names', label: 'Имена', icon: '💍', enabled: true },
  { id: 'countdown', label: 'Обратный отсчет', icon: '⏳', enabled: true },
  { id: 'story', label: 'Обращение', icon: '💌', enabled: true },
  { id: 'program', label: 'Программа', icon: '📋', enabled: true },
  { id: 'map', label: 'Карта', icon: '📍', enabled: true },
  { id: 'dresscode', label: 'Дресс-код', icon: '👗', enabled: false },
  { id: 'gallery', label: 'Галерея', icon: '📸', enabled: false },
  { id: 'rsvp', label: 'RSVP', icon: '✅', enabled: true },
  { id: 'contacts', label: 'Контакты', icon: '📞', enabled: true },
]

const templateOptions: Array<{ value: TemplateStyle; label: string }> = [
  { value: 'modern', label: 'Modern' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'national', label: 'National' },
]

const languageOptions: Array<{ value: EventLanguage | 'both'; label: string }> = [
  { value: 'ru', label: 'Русский' },
  { value: 'kk', label: 'Қазақша' },
  { value: 'both', label: 'Оба' },
]

const accentPalette = ['#7A2E3A', '#C9A96E', '#B8674D', '#2C2825', '#3B6B5F', '#5B4A8A']

type EventConstructorShellProps = {
  eventId: string
}

export function EventConstructorShell({ eventId }: EventConstructorShellProps) {
  const { data: event } = useQuery({
    queryKey: ['constructor-event', eventId],
    queryFn: () => getEvent(eventId),
    enabled: Boolean(eventId),
  })
  const { data: guests = [] } = useQuery({
    queryKey: ['constructor-guests', eventId],
    queryFn: () => getEventGuests(eventId),
    enabled: Boolean(eventId),
  })

  const [blocks, setBlocks] = useState<ConstructorBlock[]>(defaultBlocks)
  const [activeStyle, setActiveStyle] = useState<TemplateStyle>('elegant')
  const [activeLanguage, setActiveLanguage] = useState<EventLanguage | 'both'>('both')
  const [accentColor, setAccentColor] = useState('#7A2E3A')

  const sampleGuest = guests[0]
  const sampleStages = useMemo(
    () => (event ? getVisibleStages(event, sampleGuest) : []),
    [event, sampleGuest],
  )

  if (!event) {
    return null
  }

  function toggleBlock(blockId: ConstructorBlockId) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId ? { ...block, enabled: !block.enabled } : block,
      ),
    )
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
            Конструктор <span style={{ fontStyle: 'italic', color: 'var(--burgundy)' }}>приглашения</span>
          </LegacySectionTitle>
          <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginTop: 6 }}>
            Включайте, отключайте и настраивайте блоки страницы под MVP
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          alignItems: 'start',
        }}
      >
        <div>
          <LegacyCard noPadding>
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--sand)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500 }}>
                Блоки страницы
              </h3>
              <span style={{ fontSize: 11, color: 'var(--warm-gray)' }}>
                {blocks.filter((block) => block.enabled).length} из {blocks.length}
              </span>
            </div>

            {blocks.map((block, index) => (
              <div
                key={block.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '0.8rem 1.25rem',
                  borderBottom: index < blocks.length - 1 ? '1px solid var(--sand-light)' : 'none',
                  opacity: block.enabled ? 1 : 0.55,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{block.icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--charcoal)' }}>
                      {block.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--warm-gray)', marginTop: 2 }}>
                      {block.enabled ? 'Включен' : 'Скрыт'}
                    </div>
                  </div>
                </div>
                <LegacyToggle checked={block.enabled} onChange={() => toggleBlock(block.id)} />
              </div>
            ))}
          </LegacyCard>

          <LegacyCard style={{ marginTop: 16 }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 500,
                marginBottom: 16,
              }}
            >
              Стиль
            </h3>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--charcoal-soft)',
                  marginBottom: 8,
                }}
              >
                Шаблон
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {templateOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setActiveStyle(option.value)}
                    style={{
                      flex: 1,
                      padding: '0.7rem',
                      borderRadius: 12,
                      border:
                        activeStyle === option.value
                          ? '1.5px solid var(--burgundy)'
                          : '1.5px solid var(--sand)',
                      background: activeStyle === option.value ? 'var(--gold-faint)' : 'transparent',
                      color: activeStyle === option.value ? 'var(--burgundy)' : 'var(--charcoal-soft)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--charcoal-soft)',
                  marginBottom: 8,
                }}
              >
                Язык
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setActiveLanguage(option.value)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: 10,
                      border:
                        activeLanguage === option.value
                          ? '1.5px solid var(--burgundy)'
                          : '1.5px solid var(--sand)',
                      background: activeLanguage === option.value ? 'var(--burgundy)' : 'transparent',
                      color: activeLanguage === option.value ? 'var(--white)' : 'var(--charcoal-soft)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--charcoal-soft)',
                  marginBottom: 8,
                }}
              >
                Акцентный цвет
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {accentPalette.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAccentColor(color)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: color,
                      border:
                        accentColor === color
                          ? '2px solid var(--charcoal)'
                          : '2px solid transparent',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
          </LegacyCard>
        </div>

        <div style={{ position: 'sticky', top: '1rem' }}>
          <div
            style={{
              background: 'var(--charcoal)',
              borderRadius: 24,
              padding: '12px 12px 16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <div
                style={{
                  width: 100,
                  height: 4,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.15)',
                }}
              />
            </div>
            <div
              style={{
                background: 'var(--white)',
                borderRadius: 16,
                overflow: 'hidden',
                maxHeight: 620,
                overflowY: 'auto',
              }}
            >
              {blocks.find((block) => block.id === 'cover')?.enabled ? (
                <div
                  style={{
                    background: `linear-gradient(180deg, ${accentColor}, var(--burgundy-deep))`,
                    padding: '3rem 2rem 2.5rem',
                    textAlign: 'center',
                    color: 'var(--white)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'rgba(220,198,154,0.64)',
                      marginBottom: 8,
                    }}
                  >
                    {activeStyle === 'national' ? 'Той' : 'Свадьба'}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 30,
                      color: 'var(--gold-light)',
                    }}
                  >
                    {getLocalizedText(event.title, 'ru').replace(/^Свадьба\s+/i, '')}
                  </div>
                  <div
                    style={{
                      width: 30,
                      height: 1,
                      background: 'rgba(220,198,154,0.3)',
                      margin: '1rem auto',
                    }}
                  />
                  <div style={{ fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.56)' }}>
                    {formatEventDate(event.stages[0]?.date ?? event.createdAt, 'ru')}
                  </div>
                </div>
              ) : null}

              {blocks.find((block) => block.id === 'countdown')?.enabled ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--cream)' }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: 10 }}>
                    До события
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                    {[
                      ['82', 'дней'],
                      ['14', 'часов'],
                      ['32', 'минут'],
                    ].map(([value, label]) => (
                      <div key={label}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: accentColor }}>
                          {value}
                        </div>
                        <div style={{ fontSize: 9, color: 'var(--warm-gray)', marginTop: 3 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {blocks.find((block) => block.id === 'story')?.enabled ? (
                <div style={{ padding: '1.35rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 8 }}>
                    Дорогие гости!
                  </div>
                  <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--warm-gray)' }}>
                    {getLocalizedText(event.description, 'ru')}
                  </p>
                </div>
              ) : null}

              {blocks.find((block) => block.id === 'program')?.enabled ? (
                <div style={{ padding: '1.25rem 1.5rem', background: 'var(--ivory)' }}>
                  <div style={{ textAlign: 'center', marginBottom: 10 }}>
                    <LegacySectionLabel>Программа</LegacySectionLabel>
                  </div>
                  {sampleStages.map((stage) => (
                    <div key={stage.id} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: accentColor, minWidth: 40 }}>
                        {stage.time}
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--charcoal)' }}>
                          {getLocalizedText(stage.name, 'ru')}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--warm-gray)' }}>{stage.place}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {blocks.find((block) => block.id === 'map')?.enabled ? (
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <LegacyCard
                    style={{
                      background:
                        'radial-gradient(circle at top right, rgba(201,169,110,0.18), transparent 35%), var(--ivory)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: 8,
                        minHeight: 120,
                      }}
                    >
                      <Icon name="map" size={22} color="var(--warm-gray)" />
                      <div style={{ fontSize: 13, color: 'var(--charcoal)' }}>
                        {event.stages[0]?.place}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--warm-gray)' }}>
                        {event.stages[0]?.address}
                      </div>
                    </div>
                  </LegacyCard>
                </div>
              ) : null}

              {blocks.find((block) => block.id === 'dresscode')?.enabled && event.dressCode ? (
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <LegacyCard>
                    <div style={{ textAlign: 'center' }}>
                      <LegacySectionLabel>Дресс-код</LegacySectionLabel>
                      <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--warm-gray)', marginTop: 10 }}>
                        {getLocalizedText(event.dressCode, 'ru')}
                      </p>
                    </div>
                  </LegacyCard>
                </div>
              ) : null}

              {blocks.find((block) => block.id === 'rsvp')?.enabled ? (
                <div style={{ padding: '1.4rem 1.5rem', textAlign: 'center' }}>
                  <LegacySectionLabel>Подтвердите участие</LegacySectionLabel>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                    {['Буду', 'Не смогу', 'Под вопросом'].map((label, index) => (
                      <button
                        key={label}
                        type="button"
                        style={{
                          padding: '0.55rem 1rem',
                          borderRadius: 999,
                          border: 'none',
                          background: index === 0 ? accentColor : 'var(--ivory)',
                          color: index === 0 ? 'var(--white)' : 'var(--charcoal-soft)',
                          fontSize: 11,
                          cursor: 'pointer',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {blocks.find((block) => block.id === 'contacts')?.enabled ? (
                <div style={{ padding: '1.4rem 1.75rem 2rem', textAlign: 'center' }}>
                  <div style={{ marginBottom: 10 }}>
                    <LegacySectionLabel>Координатор</LegacySectionLabel>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' }}>
                    {event.coordinatorName}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--warm-gray)', marginTop: 4 }}>
                    {event.coordinatorPhone}
                  </div>
                </div>
              ) : null}

              <div style={{ padding: '0 1.5rem 1.5rem', textAlign: 'center', color: 'var(--warm-gray)', fontSize: 11 }}>
                Режим языка: {activeLanguage === 'both' ? 'RU + KK' : activeLanguage.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
