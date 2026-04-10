"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/shared/components/ui/icon";
import { Avatar } from "@/shared/components/ui";
import styles from "./sidebar.module.css";

interface NavItem {
  id: string;
  icon: IconName;
  label: string;
  href: string;
}

interface SidebarProps {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventInitials: string;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  eventId,
  eventName,
  eventDate,
  eventInitials,
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const items: NavItem[] = [
    { id: "dashboard", icon: "home", label: "Дашборд", href: `/events/${eventId}` },
    { id: "guests", icon: "users", label: "Гости", href: `/events/${eventId}/guests` },
    { id: "constructor", icon: "edit", label: "Конструктор", href: `/events/${eventId}/constructor` },
    { id: "preview", icon: "eye", label: "Предпросмотр", href: `/events/${eventId}/preview` },
    { id: "sending", icon: "send", label: "Рассылка", href: `/events/${eventId}/sending` },
  ];

  const isActive = (href: string) => {
    if (href === `/events/${eventId}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
      {/* Logo */}
      <div className={styles.logoArea}>
        <Link href={`/events/${eventId}`} className={styles.logo} onClick={onClose}>
          Qona<span className={styles.logoAccent}>q</span>
        </Link>
        <div className={styles.logoSub}>Панель организатора</div>
      </div>

      {/* Event selector */}
      <div className={styles.eventSelector}>
        <div className={styles.eventCard}>
          <div className={styles.eventAvatar}>{eventInitials}</div>
          <div className={styles.eventInfo}>
            <div className={styles.eventName}>{eventName}</div>
            <div className={styles.eventDate}>{eventDate}</div>
          </div>
          <Icon name="chevron-right" size={14} color="var(--warm-gray)" />
        </div>

        <Link href="/events/new" onClick={onClose} className={styles.newEventCard}>
          <span className={styles.newEventIcon}>
            <Icon name="plus" size={14} color="currentColor" />
          </span>
          <span className={styles.newEventContent}>
            <span className={styles.newEventTitle}>Создать событие</span>
            <span className={styles.newEventSubtitle}>Новое событие</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
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

      {/* User area */}
      <div className={styles.userArea}>
        <Avatar name="Айгерим" size={32} gradient={["var(--gold)", "var(--terra)"]} />
        <div className={styles.userInfo}>
          <div className={styles.userName}>Айгерим К.</div>
          <div className={styles.userRole}>Организатор</div>
        </div>
        <button className={styles.settingsBtn} aria-label="Settings">
          <Icon name="settings" size={16} color="var(--warm-gray)" />
        </button>
      </div>
    </aside>
  );
}
