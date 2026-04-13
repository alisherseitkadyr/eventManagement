"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/shared/components/ui/icon";
import { Avatar } from "@/shared/components/ui";
import styles from "./sidebar.module.css";

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

// Derive event ID from pathname like /events/[id] or /events/[id]/sub
function useEventId(): string | null {
  const pathname = usePathname();
  const match = pathname?.match(/^\/events\/([^/]+)/);
  // "new" is not a real event ID — it's the create wizard route
  const id = match?.[1];
  return id && id !== "new" ? id : null;
}

const GLOBAL_NAV = [
  { id: "templates",    icon: "grid"  as const, label: "Templates",         href: "/templates" },
  { id: "invitations",  icon: "home"  as const, label: "My Invitations",    href: "/" },
  { id: "create",       icon: "plus"  as const, label: "Create Invitation", href: "/events/new" },
];

function buildEventNav(eventId: string) {
  return [
    { id: "dashboard",   icon: "home"  as const, label: "Dashboard",   href: `/events/${eventId}` },
    { id: "constructor", icon: "edit"  as const, label: "Constructor", href: `/events/${eventId}/constructor` },
    { id: "guests",      icon: "users" as const, label: "Guests",      href: `/events/${eventId}/guests` },
  ];
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const eventId = useEventId();
  const navItems = eventId ? buildEventNav(eventId) : GLOBAL_NAV;

  const isActive = (href: string) => {
    if (!pathname) return false;
    // Event root needs exact match so /events/[id]/guests doesn't also mark it active
    if (eventId && href === `/events/${eventId}`) return pathname === href;
    // Home needs exact match so /templates doesn't mark "/" active
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
      {/* Logo */}
      <div className={styles.logoArea}>
        <Link href="/" className={styles.logo} onClick={onClose}>
          Qona<span className={styles.logoAccent}>q</span>
        </Link>
        <div className={styles.logoSub}>Панель организатора</div>
      </div>

      <div className={styles.scrollableMiddle}>
        {/* Back to My Invitations when inside an event */}
        {eventId && (
          <div className={styles.backArea}>
            <Link href="/" className={styles.backLink} onClick={onClose}>
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
              href={item.href}
              onClick={onClose}
              className={`${styles.navItem} ${isActive(item.href) ? styles.active : ""}`}
            >
              <Icon name={item.icon} size={18} color="currentColor" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

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
