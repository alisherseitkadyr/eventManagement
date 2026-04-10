import type { EventStats } from "@/features/events/types";

interface RSVPProgressBarProps {
  stats: EventStats;
}

export function RSVPProgressBar({ stats }: RSVPProgressBarProps) {
  const total = stats.totalGuests || 1;
  const replyPercent = Math.round(
    ((stats.confirmed + stats.declined + stats.maybe) / total) * 100
  );

  const segments = [
    { key: "confirmed", width: (stats.confirmed / total) * 100, color: "var(--success)" },
    { key: "maybe", width: (stats.maybe / total) * 100, color: "var(--warning)" },
    { key: "declined", width: (stats.declined / total) * 100, color: "var(--danger)" },
    { key: "pending", width: (stats.pending / total) * 100, color: "var(--info)" },
  ];

  const legend = [
    ["Подтвердили", "var(--success)"],
    ["Под вопросом", "var(--warning)"],
    ["Отказали", "var(--danger)"],
    ["Не ответили", "var(--info)"],
  ] as const;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 12,
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
          Прогресс ответов
        </h3>
        <span style={{ fontSize: 13, color: "var(--warm-gray)" }}>
          {replyPercent}% уже ответили
        </span>
      </div>

      <div
        style={{
          height: 10,
          background: "var(--ivory)",
          borderRadius: 100,
          overflow: "hidden",
          display: "flex",
        }}
      >
        {segments.map(({ key, width, color }) => (
          <div key={key} style={{ width: `${width}%`, background: color }} />
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        {legend.map(([label, color]) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--charcoal-soft)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                display: "block",
              }}
            />
            {label}
          </div>
        ))}
      </div>
    </>
  );
}
