import { Avatar, Badge } from "@/shared/components/ui";
import { pluralize, rsvpStatusConfig, rsvpStatusLabels, guestSideLabels } from "@/shared/lib/utils";
import type { Guest } from "@/features/guests/types";
import type { Language, RSVPStatus } from "@/shared/types/common";

interface RecentResponsesProps {
  guests: Guest[];
  lang?: Language;
}

function StatusPill({ status, lang = "ru" }: { status: RSVPStatus; lang?: Language }) {
  const config = rsvpStatusConfig[status];
  return (
    <Badge bg={config.bg} color={config.color}>
      {rsvpStatusLabels[status][lang]}
    </Badge>
  );
}

export function RecentResponses({ guests, lang = "ru" }: RecentResponsesProps) {
  const recent = [...guests]
    .filter((g) => g.status !== "pending")
    .sort((a, b) => {
      const aDate = a.respondedAt ? Date.parse(a.respondedAt) : 0;
      const bDate = b.respondedAt ? Date.parse(b.respondedAt) : 0;
      return bDate - aDate;
    })
    .slice(0, 5);

  return (
    <div style={{ display: "grid", gap: 4 }}>
      {recent.map((guest) => {
        const guestWord = pluralize(guest.count, ["человек", "человека", "человек"]);
        const subtitle = `${guest.count} ${guestWord} · ${guestSideLabels[guest.side][lang]}`;

        return (
          <div
            key={guest.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "0.72rem 0",
              borderBottom: "1px solid var(--sand-light)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <Avatar name={guest.name} />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--charcoal)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {guest.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--warm-gray)" }}>{subtitle}</div>
              </div>
            </div>
            <StatusPill status={guest.status} lang={lang} />
          </div>
        );
      })}
    </div>
  );
}
