"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/shared/components/ui";
import { Icon } from "@/shared/components/ui/icon";
import type { Language } from "@/shared/types/common";
import type { EventProject } from "@/features/events/types";
import type { Guest } from "@/features/guests/types";
import { buildClientInvitationUrl } from "@/features/invitation/api";
import { InvitationContent } from "@/features/invitation/components/invitation-content";
import { PageHeader, pageStyle, getVisibleStages } from "./organizer-ui";

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 390,
        maxWidth: "100%",
        background: "var(--charcoal)",
        borderRadius: 30,
        padding: "14px 14px 20px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        marginInline: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <div
          style={{
            width: 110,
            height: 5,
            borderRadius: 100,
            background: "rgba(255,255,255,0.12)",
          }}
        />
      </div>
      <div style={{ borderRadius: 20, overflow: "hidden", background: "var(--white)" }}>{children}</div>
    </div>
  );
}

function createPreviewGuest(event: EventProject): Guest {
  return {
    id: "preview_guest",
    eventId: event.id,
    name: "Демо-гость",
    count: 1,
    side: "common",
    category: "other",
    status: "pending",
    token: "preview",
    isVip: false,
    isElder: false,
    hasChildren: false,
    assignedStageIds: event.stages.map((stage) => stage.id),
  };
}

export function PreviewView({
  event,
  guests,
}: {
  event: EventProject;
  guests: Guest[];
}) {
  const [lang, setLang] = useState<Language>("ru");
  const [copied, setCopied] = useState(false);
  const hasGuests = guests.length > 0;
  const previewGuest = guests[0] ?? createPreviewGuest(event);
  const previewStages = getVisibleStages(event, previewGuest);

  return (
    <div style={pageStyle}>
      <PageHeader
        title={
          <>
            Предпросмотр <span style={{ fontStyle: "italic", color: "var(--burgundy)" }}>приглашения</span>
          </>
        }
        subtitle={
          hasGuests
            ? `Так приглашение увидит гость «${previewGuest.name}»`
            : "Так приглашение будет выглядеть до добавления гостей"
        }
        actions={
          <>
            <div
              style={{
                display: "flex",
                borderRadius: 100,
                border: "1.5px solid var(--sand)",
                overflow: "hidden",
              }}
            >
              {(["ru", "kz"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLang(value)}
                  style={{
                    padding: "0.45rem 0.9rem",
                    border: "none",
                    background: lang === value ? "var(--burgundy)" : "transparent",
                    color: lang === value ? "var(--white)" : "var(--charcoal-soft)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {value === "ru" ? "Рус" : "Қаз"}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              disabled={!hasGuests}
              onClick={() => {
                navigator.clipboard.writeText(buildClientInvitationUrl(previewGuest.token));
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1500);
              }}
            >
              <Icon name={copied ? "check" : "copy"} size={14} color="currentColor" />
              {!hasGuests ? "Добавьте гостя" : copied ? "Скопировано" : "Скопировать ссылку"}
            </Button>
          </>
        }
      />

      <PhoneFrame>
        <InvitationContent
          event={event}
          guest={previewGuest}
          visibleStages={previewStages}
          lang={lang}
        />
      </PhoneFrame>
    </div>
  );
}
