import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { routeBuilders } from '@app/routes/route-paths'
import {
  eventTypeEmojis,
  eventTypeLabels,
  eventTypes,
  type EventLanguage,
  type EventType,
  type TemplateStyle,
} from '@entities/event'
import { createEvent } from '@shared/api/events'
import { legacyBackground, legacyThemeVars } from '@shared/lib/legacy-theme'
import { Icon } from '@shared/ui/icon'
import { LegacyButton } from '@shared/ui/legacy-ui'

const steps = ['Тип события', 'Детали', 'Шаблон'] as const

const templateOptions: Array<{
  value: TemplateStyle
  label: string
  description: string
}> = [
  { value: 'elegant', label: 'Elegant', description: 'Утонченный минимализм с золотыми акцентами' },
  { value: 'modern', label: 'Modern', description: 'Современный и чистый дизайн' },
  { value: 'national', label: 'National', description: 'Казахские орнаменты и традиционные цвета' },
]

export function CreateEventForm() {
  const navigate = useNavigate()
  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess(event) {
      navigate(routeBuilders.eventDetails(event.id))
    },
  })

  const [step, setStep] = useState(0)
  const [eventType, setEventType] = useState<EventType>('wedding')
  const [titleRu, setTitleRu] = useState('')
  const [titleKk, setTitleKk] = useState('')
  const [languages, setLanguages] = useState<EventLanguage[]>(['ru', 'kk'])
  const [template, setTemplate] = useState<TemplateStyle>('elegant')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function toggleLang(lang: EventLanguage) {
    setLanguages((previous) =>
      previous.includes(lang)
        ? previous.length > 1
          ? previous.filter((item) => item !== lang)
          : previous
        : [...previous, lang],
    )
  }

  async function handleCreate() {
    setErrorMessage(null)

    try {
      const event = await createEventMutation.mutateAsync({
        type: eventType,
        title: {
          ru: titleRu || eventTypeLabels[eventType].ru,
          kk: titleKk || eventTypeLabels[eventType].kk,
        },
        templateStyle: template,
        languages,
      })

      navigate(routeBuilders.eventDetails(event.id))
    } catch {
      setErrorMessage('Не удалось создать событие. Попробуйте еще раз.')
    }
  }

  return (
    <div
      style={{
        ...legacyThemeVars,
        minHeight: '100vh',
        background: legacyBackground,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '3rem 1.25rem 4rem',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 680,
          background: 'var(--white)',
          borderRadius: 24,
          border: '1px solid var(--sand)',
          padding: '2.5rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <a
            href="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--burgundy)',
              textDecoration: 'none',
            }}
          >
            Qona<span style={{ color: 'var(--gold)' }}>q</span>
          </a>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {steps.map((label, index) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background:
                    index < step ? 'var(--success)' : index === step ? 'var(--burgundy)' : 'var(--sand)',
                  color: index <= step ? 'var(--white)' : 'var(--warm-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {index < step ? <Icon name="check" size={13} color="currentColor" /> : index + 1}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: index === step ? 600 : 400,
                  color: index === step ? 'var(--charcoal)' : 'var(--warm-gray)',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
              {index < steps.length - 1 ? (
                <div style={{ width: 24, height: 1, background: 'var(--sand)', flexShrink: 0 }} />
              ) : null}
            </div>
          ))}
        </div>

        {errorMessage ? (
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '0.85rem 1rem',
              borderRadius: 14,
              background: 'var(--warning-bg)',
              color: 'var(--charcoal-soft)',
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {errorMessage}
          </div>
        ) : null}

        {step === 0 ? (
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 30,
                fontWeight: 300,
                color: 'var(--charcoal)',
                marginBottom: 6,
              }}
            >
              Какое событие планируете?
            </h1>
            <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: '1.75rem' }}>
              Выберите тип, чтобы настроить шаблон и подсказки.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 10,
              }}
            >
              {eventTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventType(type)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '0.85rem 1rem',
                    borderRadius: 14,
                    border:
                      eventType === type
                        ? '1.5px solid var(--burgundy)'
                        : '1.5px solid var(--sand)',
                    background: eventType === type ? 'var(--gold-faint)' : 'var(--white)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{eventTypeEmojis[type]}</span>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: eventType === type ? 'var(--burgundy)' : 'var(--charcoal)',
                      }}
                    >
                      {eventTypeLabels[type].ru}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--warm-gray)' }}>
                      {eventTypeLabels[type].kk}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
              <LegacyButton variant="primary" onClick={() => setStep(1)}>
                Далее
                <Icon name="chevron-right" size={16} color="currentColor" />
              </LegacyButton>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 30,
                fontWeight: 300,
                color: 'var(--charcoal)',
                marginBottom: 6,
              }}
            >
              Детали события
            </h1>
            <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: '1.75rem' }}>
              Введите название и выберите языки приглашений.
            </p>

            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--charcoal-soft)',
                    marginBottom: 6,
                  }}
                >
                  Название (рус)
                </label>
                <input
                  value={titleRu}
                  onChange={(event) => setTitleRu(event.target.value)}
                  placeholder={eventTypeLabels[eventType].ru}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 12,
                    border: '1.5px solid var(--sand)',
                    fontSize: 14,
                    fontFamily: 'var(--font-body)',
                    background: 'var(--white)',
                    color: 'var(--charcoal)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--charcoal-soft)',
                    marginBottom: 6,
                  }}
                >
                  Атауы (қаз)
                </label>
                <input
                  value={titleKk}
                  onChange={(event) => setTitleKk(event.target.value)}
                  placeholder={eventTypeLabels[eventType].kk}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 12,
                    border: '1.5px solid var(--sand)',
                    fontSize: 14,
                    fontFamily: 'var(--font-body)',
                    background: 'var(--white)',
                    color: 'var(--charcoal)',
                    outline: 'none',
                  }}
                />
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
                  Языки приглашений
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['ru', 'kk'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLang(lang)}
                      style={{
                        padding: '0.6rem 1.4rem',
                        borderRadius: 999,
                        border: languages.includes(lang)
                          ? '1.5px solid var(--burgundy)'
                          : '1.5px solid var(--sand)',
                        background: languages.includes(lang) ? 'var(--burgundy)' : 'transparent',
                        color: languages.includes(lang) ? 'var(--white)' : 'var(--charcoal-soft)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {lang === 'ru' ? 'Русский' : 'Қазақша'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.75rem' }}>
              <LegacyButton variant="ghost" onClick={() => setStep(0)}>
                <Icon name="chevron-left" size={16} color="currentColor" />
                Назад
              </LegacyButton>
              <LegacyButton variant="primary" onClick={() => setStep(2)}>
                Далее
                <Icon name="chevron-right" size={16} color="currentColor" />
              </LegacyButton>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 30,
                fontWeight: 300,
                color: 'var(--charcoal)',
                marginBottom: 6,
              }}
            >
              Выберите шаблон
            </h1>
            <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: '1.75rem' }}>
              Стиль можно изменить позже в конструкторе.
            </p>

            <div style={{ display: 'grid', gap: 12 }}>
              {templateOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTemplate(option.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '1.1rem 1.25rem',
                    borderRadius: 16,
                    border:
                      template === option.value
                        ? '1.5px solid var(--burgundy)'
                        : '1.5px solid var(--sand)',
                    background: template === option.value ? 'var(--gold-faint)' : 'var(--white)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                    width: '100%',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: template === option.value ? 'var(--burgundy)' : 'var(--charcoal)',
                        marginBottom: 4,
                      }}
                    >
                      {option.label}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--warm-gray)' }}>
                      {option.description}
                    </div>
                  </div>
                  {template === option.value ? (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'var(--burgundy)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon name="check" size={13} color="var(--white)" />
                    </div>
                  ) : null}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.75rem' }}>
              <LegacyButton variant="ghost" onClick={() => setStep(1)}>
                <Icon name="chevron-left" size={16} color="currentColor" />
                Назад
              </LegacyButton>
              <LegacyButton
                variant="gold"
                loading={createEventMutation.isPending}
                onClick={handleCreate}
              >
                Создать событие
                <Icon name="check" size={16} color="currentColor" />
              </LegacyButton>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
