import type { CSSProperties, ReactNode } from "react";
import { SectionTitle } from "@/shared/components/ui";
import type { EventProject, EventStage } from "@/features/events/types";
import type { Guest } from "@/features/guests/types";

export const pageStyle: CSSProperties = {
  padding: "clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2.5rem)",
  maxWidth: 1180,
};

const subheadStyle: CSSProperties = {
  fontSize: 14,
  color: "var(--warm-gray)",
  marginTop: 6,
};

export function getVisibleStages(event: EventProject, guest?: Guest): EventStage[] {
  if (!guest || guest.assignedStageIds.length === 0) {
    return event.stages;
  }
  return event.stages.filter((stage) => guest.assignedStageIds.includes(stage.id));
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "1rem",
        flexWrap: "wrap",
        marginBottom: "1.75rem",
      }}
    >
      <div>
        <SectionTitle size="lg">{title}</SectionTitle>
        <p style={subheadStyle}>{subtitle}</p>
      </div>
      {actions ? <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div> : null}
    </div>
  );
}
