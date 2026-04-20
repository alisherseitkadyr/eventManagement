import { NavLink } from 'react-router-dom'
import { routeBuilders, routePaths } from '@app/routes/route-paths'
import { Icon, type IconName } from '@shared/ui/icon'
import { LegacyAvatar } from '@shared/ui/legacy-ui'
import type { SidebarMode } from './use-sidebar'
import css from './sidebar.module.css'

type NavItem = {
  id: string
  icon: IconName
  label: string
  href: string
  exact?: boolean
}

export type SidebarProps = {
  mode: SidebarMode
  onToggle: () => void
  locked?: boolean
  layout?: 'fixed' | 'grid'
  eventId?: string | null
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const GLOBAL_NAV: NavItem[] = [
  { id: 'templates',   icon: 'grid',  label: 'Templates',         href: routePaths.templates },
  { id: 'invitations', icon: 'home',  label: 'My Invitations',    href: routePaths.myEvents },
  { id: 'create',      icon: 'plus',  label: 'Create Invitation', href: routePaths.eventCreate },
]

function buildEventNav(eventId: string): NavItem[] {
  return [
    { id: 'dashboard',   icon: 'home',  label: 'Dashboard',   href: routeBuilders.eventDetails(eventId),    exact: true },
    { id: 'constructor', icon: 'edit',  label: 'Constructor', href: routeBuilders.eventConstructor(eventId) },
    { id: 'guests',      icon: 'users', label: 'Guests',      href: routeBuilders.eventGuests(eventId) },
  ]
}

function NavItem({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  return (
    <NavLink
      to={item.href}
      end={item.exact}
      onClick={onClick}
      className={({ isActive }) =>
        [css.navItem, isActive ? css.navItemActive : ''].filter(Boolean).join(' ')
      }
    >
      <span className={css.navIcon}>
        <Icon name={item.icon} size={18} color="currentColor" />
      </span>
      <span className={css.navLabel}>{item.label}</span>
      <span className={css.navTooltip} aria-hidden="true">{item.label}</span>
    </NavLink>
  )
}

export function Sidebar({
  mode,
  onToggle,
  locked = false,
  layout = 'fixed',
  eventId = null,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const eventNav = eventId ? buildEventNav(eventId) : null

  const classes = [
    css.sidebar,
    mode === 'rail' ? css.rail : '',
    layout === 'grid' ? css.sidebarGrid : '',
    mobileOpen ? css.mobileOpen : '',
  ].filter(Boolean).join(' ')

  return (
    <aside className={classes}>
      <div className={css.header}>
        <NavLink to={routePaths.myEvents} className={css.logo} onClick={onMobileClose}>
          <span className={css.logoFull}>
            Qona<span className={css.logoAccent}>q</span>
          </span>
          <span className={css.logoRail}>Q</span>
        </NavLink>
        {!locked && (
          <button
            type="button"
            className={css.toggleBtn}
            onClick={onToggle}
            aria-label={mode === 'full' ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Icon
              name={mode === 'full' ? 'chevron-left' : 'chevron-right'}
              size={14}
              color="currentColor"
            />
          </button>
        )}
      </div>

      <div className={css.body}>
        <nav className={css.nav}>
          {GLOBAL_NAV.map((item) => (
            <NavItem key={item.id} item={item} onClick={onMobileClose} />
          ))}
        </nav>

        {eventNav && (
          <>
            <div className={css.divider} />
            <div className={css.sectionLabel}>This Invitation</div>
            <nav className={css.nav}>
              {eventNav.map((item) => (
                <NavItem key={item.id} item={item} onClick={onMobileClose} />
              ))}
            </nav>
          </>
        )}
      </div>

      <div className={css.spacer} />

      <div className={css.footer}>
        <LegacyAvatar
          name="Айгерим"
          size={32}
          gradient={['#C9A96E', '#7A2E3A']}
        />
        <div className={css.userInfo}>
          <div className={css.userName}>Айгерим К.</div>
          <div className={css.userRole}>Организатор</div>
        </div>
        <button type="button" className={css.settingsBtn} aria-label="Settings">
          <Icon name="settings" size={15} color="currentColor" />
        </button>
      </div>
    </aside>
  )
}
