import type { CSSProperties } from "react";
import { Card } from "@/shared/components/ui";
import { pluralize } from "@/shared/lib/utils";
import type { EventStats } from "@/features/events/types";

interface StatsGridProps {
  stats: EventStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      label: "Всего гостей",
      value: stats.totalGuests,
      sub: `${stats.totalPeople} ${pluralize(stats.totalPeople, ["человек", "человека", "человек"])}`,
      accent: "var(--charcoal)",
    },
    {
      label: "Подтвердили",
      value: stats.confirmed,
      sub: `${stats.confirmedPeople} ${pluralize(stats.confirmedPeople, ["человек", "человека", "человек"])}`,
      accent: "var(--success)",
    },
    {
      label: "Не ответили",
      value: stats.pending,
      sub: "ожидают ответа",
      accent: "var(--warning)",
    },
    {
      label: "Отказали",
      value: stats.declined,
      sub: "нужно перепроверить план",
      accent: "var(--danger)",
    },
  ];

  const labelStyle: CSSProperties = {
    fontSize: 11,
    color: "var(--warm-gray)",
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 8,
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
        marginBottom: "1.9rem",
      }}
    >
      {cards.map((card) => (
        <Card key={card.label} accentColor={card.accent}>
          <div style={labelStyle}>{card.label}</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              lineHeight: 1,
              fontWeight: 300,
              color: card.accent,
            }}
          >
            {card.value}
          </div>
          <div style={{ fontSize: 12, color: "var(--warm-gray)", marginTop: 6 }}>{card.sub}</div>
        </Card>
      ))}
    </div>
  );
}
