import { Link, useLocation } from 'react-router-dom'
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
  mobileOpen?: boolean
  onClose?: () => void
}

function useEventId(): string | null {
  const { pathname } = useLocation()
  const match = pathname.match(/^\/events\/([^/]+)/)
  const id = match?.[1]
  return id && id !== 'new' ? id : null
}

const GLOBAL_NAV: NavItem[] = [
  { id: 'templates',   icon: 'grid',  label: 'Templates',         href: '/templates' },
  { id: 'invitations', icon: 'home',  label: 'My Invitations',    href: '/my-events' },
  { id: 'create',      icon: 'plus',  label: 'Create Invitation', href: '/events/new' },
]

function buildEventNav(eventId: string): NavItem[] {
  return [
    { id: 'dashboard',   icon: 'home',  label: 'Dashboard',   href: `/events/${eventId}` },
    { id: 'constructor', icon: 'edit',  label: 'Constructor', href: `/events/${eventId}/constructor` },
    { id: 'guests',      icon: 'users', label: 'Guests',      href: `/events/${eventId}/guests` },
  ]
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const { pathname } = useLocation()
  const eventId = useEventId()
  const navItems = eventId ? buildEventNav(eventId) : GLOBAL_NAV

  const isActive = (href: string) => {
    if (eventId && href === `/events/${eventId}`) return pathname === href
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
      <div className={styles.logoArea}>
        <Link to="/dashboard" className={styles.logo} onClick={onClose}>
          Qona<span className={styles.logoAccent}>q</span>
        </Link>
        <div className={styles.logoSub}>Панель организатора</div>
      </div>

      <div className={styles.scrollableMiddle}>
        {eventId && (
          <div className={styles.backArea}>
            <Link to="/dashboard" className={styles.backLink} onClick={onClose}>
              <Icon name="chevron-left" size={14} color="currentColor" />
              <span>My Invitations</span>
            </Link>
            <div className={styles.sectionLabel}>This Invitation</div>
          </div>
        )}

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              onClick={onClose}
              className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
            >
              <Icon name={item.icon} size={18} color="currentColor" />
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
