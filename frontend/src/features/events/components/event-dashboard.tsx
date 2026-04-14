"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { Card } from "@/shared/components/ui";
import { Icon } from "@/shared/components/ui/icon";
import type { EventProject, EventStats } from "@/features/events/types";
import type { Guest } from "@/features/guests/types";
import { StatsGrid } from "./StatsGrid";
import { RecentResponses } from "./RecentResponses";
import { RSVPProgressBar } from "./RSVPProgressBar";
import { PageHeader, pageStyle } from "./organizer-ui";

function linkButtonStyle(variant: "primary" | "ghost"): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "0.65rem 1.5rem",
    borderRadius: 100,
    border: variant === "ghost" ? "1.5px solid var(--sand)" : "none",
    background: variant === "ghost" ? "transparent" : "var(--burgundy)",
    color: variant === "ghost" ? "var(--charcoal-soft)" : "var(--white)",
    fontSize: 13,
    fontWeight: 500,
    textDecoration: "none",
    fontFamily: "var(--font-body)",
    letterSpacing: "0.03em",
  };
}

export function EventDashboardView({
  event,
  guests,
  stats,
}: {
  event: EventProject;
  guests: Guest[];
  stats: EventStats;
}) {
  return (
    <div style={pageStyle}>
      <PageHeader
        title={event.title.ru}
        subtitle={event.title.kz}
        actions={
          <Link href={`/events/${event.id}/constructor`} style={linkButtonStyle("primary")}>
            <Icon name="edit" size={15} color="currentColor" />
            Конструктор
          </Link>
        }
      />

      <StatsGrid stats={stats} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 500,
                color: "var(--charcoal)",
              }}
            >
              Последние ответы
            </h3>
            <Link
              href={`/events/${event.id}/guests`}
              style={{
                color: "var(--gold)",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Все →
            </Link>
          </div>
          <RecentResponses guests={guests} />
        </Card>

        <Card>
          <RSVPProgressBar stats={stats} />
        </Card>
      </div>
    </div>
  );
}
