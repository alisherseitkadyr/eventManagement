"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@/shared/components/ui";
import { Icon, type IconName } from "@/shared/components/ui/icon";
import type { EventProject } from "@/features/events/types";
import { eventTypeEmojis } from "@/shared/lib/utils";
import styles from "./sidebar.module.css";

interface NavItem {
  id: string;
  icon: IconName;
  label: string;
  href: string;
}

interface SidebarProps {
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  eventInitials?: string;
  allEvents?: EventProject[];
  mobileOpen?: boolean;
  onClose?: () => void;
}

function useEventId(): string | null {
  const pathname = usePathname();
  const match = pathname?.match(/^\/events\/([^/]+)/);
  const id = match?.[1];
  return id && id !== "new" ? id : null;
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
  const pathname = usePathname();
  const router = useRouter();
  const routeEventId = useEventId();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const currentEventId = eventId ?? routeEventId;
  const isEventMode = Boolean(currentEventId);

  const items: NavItem[] = isEventMode && currentEventId
    ? [
        { id: "dashboard", icon: "home", label: "Dashboard", href: `/events/${currentEventId}` },
        { id: "guests", icon: "users", label: "Guests", href: `/events/${currentEventId}/guests` },
        { id: "constructor", icon: "edit", label: "Constructor", href: `/events/${currentEventId}/constructor` },
        { id: "preview", icon: "eye", label: "Preview", href: `/events/${currentEventId}/preview` },
        { id: "sending", icon: "send", label: "Sending", href: `/events/${currentEventId}/sending` },
      ]
    : [
        { id: "home", icon: "home", label: "Home", href: "/" },
        { id: "templates", icon: "grid", label: "Templates", href: "/templates" },
        { id: "create", icon: "plus", label: "Create Invitation", href: "/events/new" },
      ];

  const isActive = (href: string) => {
    if (!pathname) {
      return false;
    }

    if (href === "/") {
      return pathname === "/";
    }

    if (isEventMode && currentEventId && href === `/events/${currentEventId}`) {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  const handleSwitchEvent = (id: string) => {
    setSwitcherOpen(false);
    onClose?.();
    router.push(`/events/${id}`);
  };

  const hasEventMeta = Boolean(isEventMode && eventName && eventDate && eventInitials);

  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
      <div className={styles.logoArea}>
        <Link
          href={isEventMode && currentEventId ? `/events/${currentEventId}` : "/"}
          className={styles.logo}
          onClick={onClose}
        >
          Qona<span className={styles.logoAccent}>q</span>
        </Link>
        <div className={styles.logoSub}>Organizer Panel</div>
      </div>

      <div className={styles.scrollableMiddle}>
        {isEventMode ? (
          <div className={styles.backArea}>
            <Link href="/" className={styles.backLink} onClick={onClose}>
              <Icon name="chevron-left" size={14} color="currentColor" />
              <span>Back Home</span>
            </Link>
            <div className={styles.sectionLabel}>Current Event</div>
          </div>
        ) : (
          <div className={styles.backArea}>
            <div className={styles.sectionLabel}>Workspace</div>
          </div>
        )}

        {hasEventMeta ? (
          <div className={styles.eventSelector}>
            <button
              type="button"
              className={`${styles.switcherTrigger} ${switcherOpen ? styles.switcherOpen : ""}`}
              onClick={() => setSwitcherOpen((value) => !value)}
            >
              <div className={styles.eventAvatar}>{eventInitials}</div>
              <div className={styles.eventInfo}>
                <div className={styles.eventName}>{eventName}</div>
                <div className={styles.eventDate}>{eventDate}</div>
              </div>
              <span
                style={{
                  transform: switcherOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 200ms",
                  display: "flex",
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
                    type="button"
                    className={`${styles.switcherItem} ${
                      event.id === currentEventId ? styles.switcherItemActive : ""
                    }`}
                    onClick={() => handleSwitchEvent(event.id)}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>
                      {eventTypeEmojis[event.type] ?? "🎉"}
                    </span>
                    <span className={styles.switcherItemName}>
                      {event.title?.ru || event.id}
                    </span>
                    {event.id === currentEventId ? (
                      <Icon name="check" size={13} color="var(--burgundy)" />
                    ) : null}
                  </button>
                ))}
                <div className={styles.switcherDivider} />
                <Link
                  href="/events/new"
                  className={styles.switcherNewItem}
                  onClick={() => {
                    setSwitcherOpen(false);
                    onClose?.();
                  }}
                >
                  <Icon name="plus" size={14} color="currentColor" />
                  Create Event
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        <nav className={styles.nav}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ""}`}
            >
              <Icon
                name={item.icon}
                size={18}
                color={isActive(item.href) ? "var(--burgundy)" : "var(--warm-gray)"}
              />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className={styles.userArea}>
        <Avatar name="Aigerim" size={32} gradient={["var(--gold)", "var(--terra)"]} />
        <div className={styles.userInfo}>
          <div className={styles.userName}>Aigerim K.</div>
          <div className={styles.userRole}>Organizer</div>
        </div>
        <button type="button" className={styles.settingsBtn} aria-label="Settings">
          <Icon name="settings" size={16} color="var(--warm-gray)" />
        </button>
      </div>
    </aside>
  );
}
