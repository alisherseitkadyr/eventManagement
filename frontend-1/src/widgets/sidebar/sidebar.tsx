import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { Event } from '@entities/event'
import { eventTypeEmojis } from '@entities/event'
import { routeBuilders, routePaths } from '@app/routes/route-paths'
import { getLocalizedText } from '@shared/lib/event-utils'
import { Icon, type IconName } from '@shared/ui/icon'
import { LegacyAvatar } from '@shared/ui/legacy-ui'
import styles from '@widgets/sidebar/sidebar.module.css'

type NavItem = {
  id: string
  icon: IconName
  label: string
  href: string
}

type SidebarProps = {
  eventId: string
  eventName: string
  eventDate: string
  eventInitials: string
  allEvents?: Event[]
  mobileOpen?: boolean
  onClose?: () => void
}

export function Sidebar({
  eventId,
  eventName,
  eventDate,
  eventInitials,
  allEvents = [],
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [switcherOpen, setSwitcherOpen] = useState(false)

  const items: NavItem[] = [
    { id: 'dashboard', icon: 'home', label: 'Дашборд', href: routeBuilders.eventDetails(eventId) },
    { id: 'guests', icon: 'users', label: 'Гости', href: routeBuilders.eventGuests(eventId) },
    { id: 'constructor', icon: 'edit', label: 'Конструктор', href: routeBuilders.eventConstructor(eventId) },
    { id: 'preview', icon: 'eye', label: 'Предпросмотр', href: routeBuilders.eventPreview(eventId) },
    { id: 'sending', icon: 'send', label: 'Рассылка', href: routeBuilders.eventSending(eventId) },
  ]

  function isActive(href: string) {
    if (href === routeBuilders.eventDetails(eventId)) {
      return location.pathname === href
    }

    return location.pathname.startsWith(href)
  }

  function handleSwitchEvent(id: string) {
    setSwitcherOpen(false)
    onClose?.()
    navigate(routeBuilders.eventDetails(id))
  }

  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
      <div className={styles.logoArea}>
        <Link to={routeBuilders.eventDetails(eventId)} className={styles.logo} onClick={onClose}>
          Qona<span className={styles.logoAccent}>q</span>
        </Link>
        <div className={styles.logoSub}>Панель организатора</div>
      </div>

      <div className={styles.scrollableMiddle}>
        <div className={styles.eventSelector}>
          <button
            className={`${styles.switcherTrigger} ${switcherOpen ? styles.switcherOpen : ''}`}
            onClick={() => setSwitcherOpen((value) => !value)}
            type="button"
          >
            <div className={styles.eventAvatar}>{eventInitials}</div>
            <div className={styles.eventInfo}>
              <div className={styles.eventName}>{eventName}</div>
              <div className={styles.eventDate}>{eventDate}</div>
            </div>
            <span
              style={{
                transform: switcherOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 200ms',
                display: 'flex',
              }}
            >
              <Icon name="chevron-right" size={14} color="var(--warm-gray)" />
            </span>
          </button>

          {switcherOpen ? (
            <div className={styles.switcherList}>
              {allEvents.map((event) => (
                <button
                  key={event.id}
                  className={`${styles.switcherItem} ${event.id === eventId ? styles.switcherItemActive : ''}`}
                  onClick={() => handleSwitchEvent(event.id)}
                  type="button"
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{eventTypeEmojis[event.type] ?? '🎉'}</span>
                  <span className={styles.switcherItemName}>{getLocalizedText(event.title, 'ru') || event.id}</span>
                  {event.id === eventId ? <Icon name="check" size={13} color="var(--burgundy)" /> : null}
                </button>
              ))}
              <div className={styles.switcherDivider} />
              <Link
                to={routePaths.eventCreate}
                className={styles.switcherNewItem}
                onClick={() => {
                  setSwitcherOpen(false)
                  onClose?.()
                }}
              >
                <Icon name="plus" size={14} color="currentColor" />
                Создать событие
              </Link>
            </div>
          ) : null}
        </div>

        <nav className={styles.nav}>
          {items.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              onClick={onClose}
              className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ''}`}
            >
              <Icon
                name={item.icon}
                size={18}
                color={isActive(item.href) ? 'var(--burgundy)' : 'var(--warm-gray)'}
              />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className={styles.userArea}>
        <LegacyAvatar name="Айгерим" size={32} gradient={['var(--gold)', 'var(--terra)']} />
        <div className={styles.userInfo}>
          <div className={styles.userName}>Айгерим К.</div>
          <div className={styles.userRole}>Организатор</div>
        </div>
        <button className={styles.settingsBtn} type="button" aria-label="Settings">
          <Icon name="settings" size={16} color="var(--warm-gray)" />
        </button>
      </div>
    </aside>
  )
}
