import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { routePaths } from '@app/routes/route-paths'
import type { TemplateFull } from '@entities/template/model/types'
import { fetchTemplateById } from '@shared/api/templates'
import { legacyBackground, legacyThemeVars } from '@shared/lib/legacy-theme'
import { Icon } from '@shared/ui/icon'
import styles from './template-preview.module.css'

type DeviceMode = 'desktop' | 'mobile'

type PreviewContent = {
  title: string
  subtitle: string
  description: string
  date: string
  time: string
  location: string
  address: string
  buttonText: string
  footer: string
  backgroundImage?: string
}

function getPreviewContent(template: TemplateFull | null): PreviewContent {
  const content = template?.content

  return {
    title: content?.title ?? template?.name ?? 'Template Preview',
    subtitle: content?.subtitle ?? 'Invitation Experience',
    description:
      content?.description ??
      'This preview area is ready for real template rendering. Replace this content with your production template blocks when the final renderer is available.',
    date: content?.date ?? 'June 30, 2026',
    time: content?.time ?? '6:30 PM',
    location: content?.location ?? 'Grand Hall',
    address: content?.address ?? '123 Celebration Avenue',
    buttonText: content?.buttonText ?? 'RSVP Now',
    footer: content?.footer ?? 'Designed to feel polished on every screen size.',
    backgroundImage: content?.backgroundImage,
  }
}

function DeviceToggle({
  value,
  onChange,
}: {
  value: DeviceMode
  onChange: (mode: DeviceMode) => void
}) {
  return (
    <div className={styles.deviceToggle} aria-label="Preview device mode" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={value === 'desktop'}
        className={`${styles.deviceToggleButton} ${value === 'desktop' ? styles.deviceToggleButtonActive : ''}`}
        onClick={() => onChange('desktop')}
      >
        <span className={styles.deviceToggleLabel}>PC</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === 'mobile'}
        className={`${styles.deviceToggleButton} ${value === 'mobile' ? styles.deviceToggleButtonActive : ''}`}
        onClick={() => onChange('mobile')}
      >
        <span className={styles.deviceToggleLabel}>Mobile</span>
      </button>
    </div>
  )
}

function HeaderCenter({
  templateName,
  deviceMode,
  onDeviceModeChange,
}: {
  templateName: string
  deviceMode: DeviceMode
  onDeviceModeChange: (mode: DeviceMode) => void
}) {
  return (
    <div className={styles.centerPanel}>
      <div className={styles.templateIdentity}>
        <span className={styles.templateEyebrow}>Preview Mode</span>
        <span className={styles.templateName}>{templateName}</span>
      </div>
      <DeviceToggle value={deviceMode} onChange={onDeviceModeChange} />
    </div>
  )
}

function InvitationPreviewSurface({
  content,
  compact,
}: {
  content: PreviewContent
  compact?: boolean
}) {
  const heroStyle = content.backgroundImage
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(38, 24, 29, 0.18), rgba(38, 24, 29, 0.72)), url('${content.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined

  return (
    <article className={`${styles.surface} ${compact ? styles.surfaceCompact : ''}`}>
      <section className={styles.surfaceHero} style={heroStyle}>
        <div className={styles.surfaceKicker}>{content.subtitle}</div>
        <h1 className={styles.surfaceTitle}>{content.title}</h1>
        <p className={styles.surfaceDescription}>{content.description}</p>
      </section>

      <section className={styles.surfaceBody}>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Date</span>
            <strong className={styles.infoValue}>{content.date}</strong>
            <span className={styles.infoMeta}>{content.time}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Location</span>
            <strong className={styles.infoValue}>{content.location}</strong>
            <span className={styles.infoMeta}>{content.address}</span>
          </div>
        </div>

        <div className={styles.storyBlock}>
          <div className={styles.storyEyebrow}>Preview Content</div>
          <p className={styles.storyText}>
            This is a modular preview surface meant to be replaced by live template blocks later. The layout keeps
            focus on the invitation itself while still making device changes obvious and smooth.
          </p>
        </div>

        <div className={styles.ctaRow}>
          <button type="button" className={styles.primaryCta}>
            {content.buttonText}
          </button>
          <button type="button" className={styles.secondaryCta}>
            View Details
          </button>
        </div>

        <footer className={styles.surfaceFooter}>{content.footer}</footer>
      </section>
    </article>
  )
}

function DesktopPreview({ content }: { content: PreviewContent }) {
  return (
    <div className={styles.desktopFrame}>
      <div className={styles.browserChrome}>
        <div className={styles.browserDots}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.browserAddress}>preview.qonaq/templates</div>
      </div>
      <div className={styles.desktopCanvas}>
        <InvitationPreviewSurface content={content} />
      </div>
    </div>
  )
}

function MobilePreview({ content }: { content: PreviewContent }) {
  return (
    <div className={styles.phoneFrame}>
      <div className={styles.phoneNotch} />
      <div className={styles.phoneCanvas}>
        <InvitationPreviewSurface content={content} compact />
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className={styles.statePanel}>
      <div className={styles.stateTitle}>Loading template preview...</div>
      <p className={styles.stateText}>Preparing the full-screen preview canvas.</p>
    </div>
  )
}

function ErrorState({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.statePanel}>
      <div className={styles.stateTitle}>Template not found</div>
      <p className={styles.stateText}>The selected template could not be loaded. Return to the templates list and try another one.</p>
      <button type="button" className={styles.primaryAction} onClick={onClose}>
        Back to templates
      </button>
    </div>
  )
}

export function TemplatePreviewPage() {
  const navigate = useNavigate()
  const { templateId } = useParams()
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [templatesById, setTemplatesById] = useState<Record<string, TemplateFull | null>>({})
  const hasTemplateId = typeof templateId === 'string' && templateId.length > 0

  const template = hasTemplateId ? templatesById[templateId] ?? null : null
  const loading = hasTemplateId && !(templateId in templatesById)

  useEffect(() => {
    let active = true

    if (!hasTemplateId || templateId in templatesById) {
      return undefined
    }

    fetchTemplateById(templateId)
      .then((data) => {
        if (active) {
          setTemplatesById((current) => ({
            ...current,
            [templateId]: data,
          }))
        }
      })
      .catch(() => {
        if (active) {
          setTemplatesById((current) => ({
            ...current,
            [templateId]: null,
          }))
        }
      })

    return () => {
      active = false
    }
  }, [hasTemplateId, templateId, templatesById])

  const previewContent = useMemo(() => getPreviewContent(template), [template])

  const handleClose = () => {
    navigate(routePaths.templates)
  }

  const handleCustomize = () => {
    if (!templateId) {
      navigate(routePaths.eventCreate)
      return
    }

    navigate(`${routePaths.eventCreate}?template=${templateId}`)
  }

  return (
    <div
      className={styles.page}
      style={{
        ...legacyThemeVars,
        background: legacyBackground,
        fontFamily: 'var(--font-body)',
      }}
    >
      <header className={styles.header}>
        <div className={styles.headerSide}>
          <button type="button" className={styles.iconButton} aria-label="Close preview" onClick={handleClose}>
            <Icon name="x" size={18} color="currentColor" />
          </button>
        </div>

        <div className={styles.headerCenter}>
          <HeaderCenter
            templateName={template?.name ?? 'Template Preview'}
            deviceMode={deviceMode}
            onDeviceModeChange={setDeviceMode}
          />
        </div>

        <div className={`${styles.headerSide} ${styles.headerSideRight}`}>
          <button type="button" className={styles.primaryAction} onClick={handleCustomize}>
            Customize
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.stage} aria-label="Template preview area">
          {loading ? <LoadingState /> : null}
          {!loading && !template ? <ErrorState onClose={handleClose} /> : null}
          {!loading && template ? (
            <div className={`${styles.previewWrap} ${deviceMode === 'mobile' ? styles.previewWrapMobile : ''}`}>
              <div className={styles.previewViewport}>
                <div className={`${styles.previewTransition} ${deviceMode === 'mobile' ? styles.previewTransitionMobile : ''}`}>
                  {deviceMode === 'desktop' ? (
                    <DesktopPreview content={previewContent} />
                  ) : (
                    <MobilePreview content={previewContent} />
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  )
}
