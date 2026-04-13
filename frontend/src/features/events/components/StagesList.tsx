import { formatDate } from "@/shared/lib/utils";
import type { EventStage } from "@/features/events/types";

interface StagesListProps {
  stages: EventStage[];
}

const STAGE_GRADIENTS = [
  "linear-gradient(135deg, var(--burgundy), var(--burgundy-deep))",
  "linear-gradient(135deg, var(--gold), var(--terra))",
  "linear-gradient(135deg, var(--terra), var(--burgundy))",
];

export function StagesList({ stages }: StagesListProps) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {stages.map((stage, index) => (
        <div
          key={stage.id}
          style={{
            display: "flex",
            gap: 14,
            paddingBottom: 12,
            borderBottom:
              index < stages.length - 1 ? "1px solid var(--sand-light)" : "none",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: STAGE_GRADIENTS[index % STAGE_GRADIENTS.length],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--white)",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {stage.emoji ?? "✨"}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--charcoal)" }}>
              {stage.name.ru}
            </div>
            <div style={{ fontSize: 12, color: "var(--warm-gray)", marginTop: 3 }}>
              {formatDate(stage.date, "ru")} · {stage.time}
            </div>
            <div style={{ fontSize: 12, color: "var(--warm-gray)" }}>{stage.place}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
