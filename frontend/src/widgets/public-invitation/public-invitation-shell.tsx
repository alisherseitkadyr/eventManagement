import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { EventLanguage } from '@entities/event'
import { rsvpStatusLabels } from '@entities/guest'
import { getInvitation, openInvitation } from '@shared/api/invitation'
import { formatEventDate } from '@shared/lib/event-utils'
import {
  legacyBackground,
  legacyStatusStyles,
  legacyThemeVars,
} from '@shared/lib/legacy-theme'
import { Icon } from '@shared/ui/icon'
import {
  LegacyBadge,
  LegacyCard,
  LegacySectionTitle,
} from '@shared/ui/legacy-ui'
import { InvitationContent } from '@widgets/invitation-content'

type PublicInvitationShellProps = {
  token: string
}

export function PublicInvitationShell({ token }: PublicInvitationShellProps) {
  const [lang, setLang] = useState<EventLanguage>('ru')
  const { data: invitation } = useQuery({
    queryKey: ['public-invitation', token],
    queryFn: () => getInvitation(token),
    enabled: Boolean(token),
  })

  useEffect(() => {
    if (token) {
      void openInvitation(token)
    }
  }, [token])

  if (!invitation) {
    return null
  }

  const leadStage = invitation.visibleStages[0] ?? invitation.event.stages[0]
  const responseStatus = invitation.response?.status

  return (
    <div
      style={{
        ...legacyThemeVars,
        minHeight: '100vh',
        background: legacyBackground,
        padding: '1.25rem',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                fontWeight: 600,
                color: 'var(--burgundy)',
              }}
            >
              Qona<span style={{ color: 'var(--gold)' }}>q</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 4 }}>
              Персональное цифровое приглашение
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                borderRadius: 999,
                border: '1.5px solid var(--sand)',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.78)',
              }}
            >
              {(['ru', 'kk'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLang(value)}
                  style={{
                    padding: '0.45rem 0.95rem',
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
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 22,
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'grid', gap: 16 }}>
            <LegacyCard>
              <LegacyBadge bg="var(--gold-faint)" color="var(--burgundy)">
                {lang === 'ru' ? 'Ваше приглашение' : 'Сіздің шақыруыңыз'}
              </LegacyBadge>
              <div style={{ marginTop: 12 }}>
                <LegacySectionTitle size="md">{invitation.guest.name}</LegacySectionTitle>
                <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginTop: 8, lineHeight: 1.7 }}>
                  {lang === 'ru'
                    ? 'Здесь собраны программа события, адреса и форма подтверждения участия.'
                    : 'Мұнда бағдарлама, мекенжайлар және қатысуды растау формасы бар.'}
                </p>
              </div>
            </LegacyCard>

            <LegacyCard>
              <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                {lang === 'ru' ? 'Событие' : 'Оқиға'}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28,
                  lineHeight: 1.15,
                  color: 'var(--charcoal)',
                  marginTop: 10,
                }}
              >
                {invitation.event.title[lang]}
              </div>
              {leadStage ? (
                <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon name="calendar" size={16} color="var(--burgundy)" />
                    <span style={{ fontSize: 13, color: 'var(--charcoal-soft)' }}>
                      {formatEventDate(leadStage.date, lang)} · {leadStage.time}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon name="map" size={16} color="var(--burgundy)" />
                    <span style={{ fontSize: 13, color: 'var(--charcoal-soft)' }}>
                      {leadStage.place}
                    </span>
                  </div>
                </div>
              ) : null}
            </LegacyCard>

            {responseStatus ? (
              <LegacyCard>
                <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  {lang === 'ru' ? 'Ваш статус' : 'Сіздің мәртебеңіз'}
                </div>
                <div style={{ marginTop: 12 }}>
                  <LegacyBadge
                    bg={legacyStatusStyles[responseStatus].bg}
                    color={legacyStatusStyles[responseStatus].color}
                  >
                    {rsvpStatusLabels[responseStatus][lang]}
                  </LegacyBadge>
                </div>
                <p style={{ fontSize: 13, color: 'var(--warm-gray)', lineHeight: 1.7, marginTop: 12 }}>
                  {lang === 'ru'
                    ? 'При желании вы можете изменить ответ прямо в приглашении.'
                    : 'Қаласаңыз, жауабыңызды шақырудың ішінде өзгерте аласыз.'}
                </p>
              </LegacyCard>
            ) : null}
          </div>

          <div
            style={{
              width: 390,
              maxWidth: '100%',
              marginInline: 'auto',
              background: 'var(--charcoal)',
              borderRadius: 30,
              padding: '14px 14px 20px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
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
              event={invitation.event}
              guest={invitation.guest}
              visibleStages={invitation.visibleStages}
              initialResponse={invitation.response}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
