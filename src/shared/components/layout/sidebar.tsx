"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon, type IconName } from "@/shared/components/ui/icon";
import { Avatar } from "@/shared/components/ui";
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
  eventId: string;
  eventName: string;
  eventDate: string;
  eventInitials: string;
  allEvents?: EventProject[];
  mobileOpen?: boolean;
  onClose?: () => void;
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
  const [switcherOpen, setSwitcherOpen] = useState(false);

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

  const handleSwitchEvent = (id: string) => {
    setSwitcherOpen(false);
    onClose?.();
    router.push(`/events/${id}`);
  };

  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
      {/* Logo — fixed top */}
      <div className={styles.logoArea}>
        <Link href="/dashboard" className={styles.logo} onClick={onClose}>
          Qona<span className={styles.logoAccent}>q</span>
        </Link>
        <div className={styles.logoSub}>Панель организатора</div>
      </div>

      {/* Scrollable middle: switcher + nav */}
      <div className={styles.scrollableMiddle}>
        {/* Event switcher */}
        <div className={styles.eventSelector}>
          <button
            className={`${styles.switcherTrigger} ${switcherOpen ? styles.switcherOpen : ""}`}
            onClick={() => setSwitcherOpen((v) => !v)}
          >
            <div className={styles.eventAvatar}>{eventInitials}</div>
            <div className={styles.eventInfo}>
              <div className={styles.eventName}>{eventName}</div>
              <div className={styles.eventDate}>{eventDate}</div>
            </div>
            <span style={{ transform: switcherOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 200ms", display: "flex" }}>
              <Icon name="chevron-right" size={14} color="var(--warm-gray)" />
            </span>
          </button>

          {switcherOpen && (
            <div className={styles.switcherList}>
              {allEvents.map((ev) => (
                <button
                  key={ev.id}
                  className={`${styles.switcherItem} ${ev.id === eventId ? styles.switcherItemActive : ""}`}
                  onClick={() => handleSwitchEvent(ev.id)}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>
                    {eventTypeEmojis[ev.type] ?? "🎉"}
                  </span>
                  <span className={styles.switcherItemName}>
                    {ev.title?.ru || ev.id}
                  </span>
                  {ev.id === eventId && (
                    <Icon name="check" size={13} color="var(--burgundy)" />
                  )}
                </button>
              ))}
              <div className={styles.switcherDivider} />
              <Link
                href="/events/new"
                className={styles.switcherNewItem}
                onClick={() => { setSwitcherOpen(false); onClose?.(); }}
              >
                <Icon name="plus" size={14} color="currentColor" />
                Создать событие
              </Link>
            </div>
          )}
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
      </div>

      {/* User area — fixed bottom */}
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
