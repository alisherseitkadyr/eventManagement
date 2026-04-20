import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { routeBuilders, routePaths } from '@app/routes/route-paths'
import type { Event, EventLanguage, TemplateStyle } from '@entities/event'
import type { Block } from '@entities/invitation'
import { getDefaultInvitation } from '@entities/invitation'
import type { DeviceMode, SaveState } from '@features/invitation-editor'
import {
  BlockListPanel,
  BlockPropertiesPanel,
  StylePanel,
  useEditorKeyboard,
  useEditorStore,
} from '@features/invitation-editor'
import { getEvent } from '@shared/api/events'
import { formatEventDate, getLocalizedText } from '@shared/lib/event-utils'
import { legacyPageStyle } from '@shared/lib/legacy-theme'
import { Icon } from '@shared/ui/icon'
import { Sidebar } from '@widgets/sidebar'
import css from './event-constructor-shell.module.css'
import { InvitationCanvas } from './invitation-canvas'

type EventConstructorShellProps = {
  eventId: string
}

type InspectorTab = 'properties' | 'style'

const DEVICE_SIZE: Record<DeviceMode, string> = {
  mobile: '390×720',
  desktop: '960×680',
}

const SAVE_STATE_LABELS: Record<SaveState, string> = {
  saved: 'Saved locally',
  saving: 'Saving draft...',
  unsaved: 'Unsaved changes',
}

function getPaletteFromTemplate(style: TemplateStyle) {
  switch (style) {
    case 'modern':
      return 'mono'
    case 'national':
      return 'olive'
    case 'elegant':
    default:
      return 'gold'
  }
}

function getPreferredLanguage(event: Event): EventLanguage {
  return event.languages.includes('kk') ? 'kk' : 'ru'
}

function stripInvitationPrefix(value: string) {
  return value
    .replace(/^свадьба\s+/i, '')
    .replace(/^приглашение\s+на\s+/i, '')
    .replace(/\s+тойы$/i, '')
    .trim()
}

function createSeedBlocks(event: Event): Block[] {
  const preferredLanguage = getPreferredLanguage(event)
  const leadStage = event.stages[0]
  const invitationTitle = getLocalizedText(event.title, preferredLanguage)
  const description =
    getLocalizedText(event.description, preferredLanguage) ||
    getLocalizedText(event.title, preferredLanguage)

  return getDefaultInvitation().map((block) => {
    if (block.id === 'b2' && block.type === 'text') {
      return {
        ...block,
        props: {
          ...block.props,
          content:
            preferredLanguage === 'kk' ? 'ЦИФРЛЫҚ ШАҚЫРУ' : 'DIGITAL INVITATION',
        },
      }
    }

    if (block.id === 'b3' && block.type === 'names') {
      return {
        ...block,
        props: {
          ...block.props,
          content: stripInvitationPrefix(invitationTitle) || invitationTitle,
        },
      }
    }

    if (block.id === 'b5' && block.type === 'text') {
      return {
        ...block,
        props: {
          ...block.props,
          content: description,
          family: preferredLanguage === 'kk' ? 'sans' : block.props.family,
        },
      }
    }

    if (block.id === 'b6' && block.type === 'datetime' && leadStage) {
      return {
        ...block,
        props: {
          ...block.props,
          dateText: formatEventDate(leadStage.date, preferredLanguage),
          timeText: leadStage.time,
        },
      }
    }

    if (block.id === 'b7' && block.type === 'venue' && leadStage) {
      return {
        ...block,
        props: {
          ...block.props,
          venueName: leadStage.place,
          address: leadStage.address,
          mapUrl: `https://2gis.kz/search/${encodeURIComponent(
            `${leadStage.place} ${leadStage.address}`,
          )}`,
        },
      }
    }

    if (block.id === 'b8' && block.type === 'button') {
      return {
        ...block,
        props: {
          ...block.props,
          buttons: [
            {
              id: 'btn-cal',
              label: preferredLanguage === 'kk' ? 'Күнтізбеге' : 'В календарь',
              icon: '📅',
            },
            {
              id: 'btn-map',
              label: '2GIS карта',
              icon: '🗺️',
              url: block.props.buttons[0]?.url ?? '',
            },
          ],
        },
      }
    }

    return block
  })
}

function useCompactViewport(maxWidth = 1180) {
  const getMatches = () =>
    typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${maxWidth}px)`).matches
      : false

  const [matches, setMatches] = useState(getMatches)

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${maxWidth}px)`)
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches)

    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [maxWidth])

  return matches
}

export function EventConstructorShell({ eventId }: EventConstructorShellProps) {
  const navigate = useNavigate()
  const isCompactViewport = useCompactViewport()
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('properties')
  const [sidebarPinned, setSidebarPinned] = useState(true)
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)

  const loadProject = useEditorStore((state) => state.loadProject)
  const currentProjectId = useEditorStore((state) => state.projectId)
  const title = useEditorStore((state) => state.title)
  const device = useEditorStore((state) => state.device)
  const saveState = useEditorStore((state) => state.saveState)
  const blocksCount = useEditorStore((state) => state.blocks.length)
  const setDevice = useEditorStore((state) => state.setDevice)
  const setTitle = useEditorStore((state) => state.setTitle)

  useEditorKeyboard()

  const {
    data: event,
    isPending: isEventPending,
    error: eventError,
  } = useQuery({
    queryKey: ['constructor-event', eventId],
    queryFn: () => getEvent(eventId),
    enabled: Boolean(eventId),
  })

  useEffect(() => {
    if (!event || currentProjectId === event.id) {
      return
    }

    loadProject(event.id, {
      title: stripInvitationPrefix(getLocalizedText(event.title, getPreferredLanguage(event))),
      palette: getPaletteFromTemplate(event.templateStyle),
      blocks: createSeedBlocks(event),
    })
  }, [currentProjectId, event, loadProject])

  const sidebarOpen = isCompactViewport ? sidebarMobileOpen : sidebarPinned

  const handleSidebarToggle = () => {
    if (isCompactViewport) {
      setSidebarMobileOpen((current) => !current)
      return
    }

    setSidebarPinned((current) => !current)
  }

  if (isEventPending) {
    return (
      <div style={legacyPageStyle} className={css.statePage}>
        <div className={css.stateCard}>
          <div className={css.stateTitle}>Loading constructor...</div>
          <p className={css.stateText}>
            Fetching event data and preparing the invitation editor.
          </p>
        </div>
      </div>
    )
  }

  if (eventError || !event) {
    return (
      <div style={legacyPageStyle} className={css.statePage}>
        <div className={css.stateCard}>
          <div className={css.stateTitle}>Event not found</div>
          <p className={css.stateText}>
            We could not load this event constructor. Please reopen the event from the
            dashboard and try again.
          </p>
        </div>
      </div>
    )
  }

  const previewHref = routeBuilders.eventPreview(event.id)
  const contextItems = [
    { id: 'constructor', label: 'Constructor', to: routeBuilders.eventConstructor(event.id) },
    { id: 'guests', label: 'Guests', to: routeBuilders.eventGuests(event.id) },
    { id: 'preview', label: 'Preview', to: previewHref },
  ] as const

  return (
    <div className={css.page}>
      {isCompactViewport && sidebarOpen ? (
        <button
          type="button"
          className={css.overlay}
          aria-label="Close structure panel"
          onClick={() => setSidebarMobileOpen(false)}
        />
      ) : null}

      <Sidebar
        mode="rail"
        onToggle={() => {}}
        locked
        layout="grid"
        eventId={event.id}
      />

      <div className={css.workspace}>
        <header className={css.topbar}>
          <div className={css.topbarGroup}>
            <button
              type="button"
              className={css.iconButton}
              aria-label={sidebarOpen ? 'Hide structure panel' : 'Show structure panel'}
              aria-pressed={sidebarOpen}
              onClick={handleSidebarToggle}
            >
              <Icon name="list" size={16} color="currentColor" />
            </button>

            <Link to={routePaths.myEvents} className={css.backLink}>
              <Icon name="chevron-left" size={14} color="currentColor" />
              <span>My Invitations</span>
            </Link>

            <input
              className={css.titleInput}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-label="Invitation title"
            />

            <div className={css.vsep} />

            <div className={css.contextTabs}>
              {contextItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `${css.contextTab} ${isActive ? css.contextTabActive : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className={css.topbarGroup}>
            <div className={css.deviceSwitcher}>
              <button
                type="button"
                className={`${css.deviceButton} ${device === 'mobile' ? css.deviceButtonActive : ''}`}
                onClick={() => setDevice('mobile')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="7" y="2" width="10" height="20" rx="2" />
                </svg>
                Mobile
              </button>

              <button
                type="button"
                className={`${css.deviceButton} ${device === 'desktop' ? css.deviceButtonActive : ''}`}
                onClick={() => setDevice('desktop')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                </svg>
                Desktop
              </button>
            </div>

            <span className={css.canvasMeta}>
              {DEVICE_SIZE[device]} · {blocksCount} blocks
            </span>
          </div>

          <div className={css.topbarGroup}>
            <div className={css.saveChip}>
              <span
                className={`${css.saveDot} ${
                  saveState === 'saved'
                    ? css.saveDotSaved
                    : saveState === 'saving'
                      ? css.saveDotSaving
                      : css.saveDotUnsaved
                }`}
              />
              {SAVE_STATE_LABELS[saveState]}
            </div>

            <div className={css.vsep} />

            <button
              type="button"
              className={css.secondaryButton}
              onClick={() => navigate(previewHref)}
            >
              Preview
            </button>

            <span
              className={`${css.publishChip} ${event.published ? css.publishChipLive : ''}`}
            >
              {event.published ? 'Published' : 'Draft'}
            </span>
          </div>
        </header>

        <div className={`${css.main} ${sidebarOpen ? css.mainSidebarOpen : css.mainSidebarClosed}`}>
          <aside
            className={`${css.structurePanel} ${
              sidebarOpen ? css.structurePanelOpen : css.structurePanelClosed
            }`}
          >
            <div className={css.structurePanelInner}>
              <BlockListPanel />
            </div>
          </aside>

          <section className={css.canvasPanel}>
            <InvitationCanvas />
          </section>

          <aside className={css.inspectorPanel}>
            <div className={css.inspectorTabs}>
              <button
                type="button"
                className={`${css.inspectorTab} ${
                  inspectorTab === 'properties' ? css.inspectorTabActive : ''
                }`}
                onClick={() => setInspectorTab('properties')}
              >
                Properties
              </button>
              <button
                type="button"
                className={`${css.inspectorTab} ${
                  inspectorTab === 'style' ? css.inspectorTabActive : ''
                }`}
                onClick={() => setInspectorTab('style')}
              >
                Style
              </button>
            </div>

            <div className={css.inspectorBody}>
              {inspectorTab === 'properties' ? (
                <BlockPropertiesPanel embedded />
              ) : (
                <StylePanel embedded />
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
