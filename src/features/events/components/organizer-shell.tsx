"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { Icon } from "@/shared/components/ui/icon";
import { formatDate } from "@/shared/lib/utils";
import type { EventProject } from "@/features/events/types";
import styles from "./organizer-shell.module.css";

interface OrganizerShellProps {
  event: EventProject;
  children: ReactNode;
}

function getInitials(title: string): string {
  const compact = title
    .replace(/свадьба|той|приглашение/gi, "")
    .replace(/[^\p{L}\s&]/gu, " ")
    .split(/[&\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return compact || title.slice(0, 2).toUpperCase();
}

export function OrganizerShell({ event, children }: OrganizerShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const eventDate = formatDate(event.stages[0]?.date ?? event.createdAt, "ru");
  const eventTitle = event.title.ru;
  const eventInitials = getInitials(eventTitle);

  return (
    <div className={styles.shell}>
      <Sidebar
        eventId={event.id}
        eventName={eventTitle}
        eventDate={eventDate}
        eventInitials={eventInitials}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {mobileOpen ? (
        <button
          type="button"
          className={styles.overlay}
          aria-label="Закрыть меню"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className={styles.mainArea}>
        <div className={styles.mobileBar}>
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-label="Открыть меню"
            onClick={() => setMobileOpen(true)}
          >
            <Icon name="menu" size={20} color="currentColor" />
          </button>
          <div className={styles.mobileEventMeta}>
            <div className={styles.mobileEventTitle}>{eventTitle}</div>
            <div className={styles.mobileEventDate}>{eventDate}</div>
          </div>
        </div>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
