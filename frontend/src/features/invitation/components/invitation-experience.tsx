"use client";

import { useState } from "react";
import { Badge, Card, SectionTitle } from "@/shared/components/ui";
import { Icon } from "@/shared/components/ui/icon";
import { formatDate, rsvpStatusConfig, rsvpStatusLabels } from "@/shared/lib/utils";
import type { Language } from "@/shared/types/common";
import type { InvitationPayload } from "@/features/invitation/api";
import { buildClientInvitationUrl } from "@/features/invitation/api";
import { InvitationContent } from "@/features/invitation/components/invitation-content";

export function InvitationExperience({ invitation }: { invitation: InvitationPayload }) {
  const [lang, setLang] = useState<Language>("ru");
  
  const leadStage = invitation.visibleStages[0] ?? invitation.event.stages[0];
  const responseStatus = invitation.response?.status;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(201,169,110,0.14), transparent 28%), linear-gradient(180deg, var(--cream) 0%, #f8f0e8 100%)",
        padding: "1.25rem",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 600,
                color: "var(--burgundy)",
              }}
            >
              Qona<span style={{ color: "var(--gold)" }}>q</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--warm-gray)", marginTop: 4 }}>
              Персональное цифровое приглашение
            </div>
          </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div
                style={{
                  display: "flex",
                  borderRadius: 100,
                  border: "1.5px solid var(--sand)",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.78)",
                }}
              >
                {(["ru", "kz"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLang(value)}
                    style={{
                      padding: "0.45rem 0.95rem",
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
            </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 22,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 16 }}>
            <Card>
              <Badge bg="var(--gold-faint)" color="var(--burgundy)">
                {lang === "ru" ? "Ваше приглашение" : "Сіздің шақыруыңыз"}
              </Badge>
              <div style={{ marginTop: 12 }}>
                <SectionTitle size="md">{invitation.guest.name}</SectionTitle>
                <p style={{ fontSize: 14, color: "var(--warm-gray)", marginTop: 8, lineHeight: 1.7 }}>
                  {lang === "ru"
                    ? "Здесь собраны программа события, адреса и форма подтверждения участия."
                    : "Мұнда бағдарлама, мекенжайлар және қатысуды растау формасы бар."}
                </p>
              </div>
            </Card>

            <Card>
              <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)" }}>
                {lang === "ru" ? "Событие" : "Оқиға"}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  lineHeight: 1.15,
                  color: "var(--charcoal)",
                  marginTop: 10,
                }}
              >
                {invitation.event.title[lang]}
              </div>
              {leadStage ? (
                <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon name="calendar" size={16} color="var(--burgundy)" />
                    <span style={{ fontSize: 13, color: "var(--charcoal-soft)" }}>
                      {formatDate(leadStage.date, lang)} · {leadStage.time}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon name="map" size={16} color="var(--burgundy)" />
                    <span style={{ fontSize: 13, color: "var(--charcoal-soft)" }}>{leadStage.place}</span>
                  </div>
                </div>
              ) : null}
            </Card>

            {responseStatus ? (
              <Card>
                <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)" }}>
                  {lang === "ru" ? "Ваш статус" : "Сіздің мәртебеңіз"}
                </div>
                <div style={{ marginTop: 12 }}>
                  <Badge
                    bg={rsvpStatusConfig[responseStatus].bg}
                    color={rsvpStatusConfig[responseStatus].color}
                  >
                    {rsvpStatusLabels[responseStatus][lang]}
                  </Badge>
                </div>
                <p style={{ fontSize: 13, color: "var(--warm-gray)", lineHeight: 1.7, marginTop: 12 }}>
                  {lang === "ru"
                    ? "При желании вы можете изменить ответ прямо в приглашении."
                    : "Қаласаңыз, жауабыңызды шақырудың ішінде өзгерте аласыз."}
                </p>
              </Card>
            ) : null}
          </div>

          <div
            style={{
              width: 390,
              maxWidth: "100%",
              marginInline: "auto",
              background: "var(--charcoal)",
              borderRadius: 30,
              padding: "14px 14px 20px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
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
            <InvitationContent
              event={invitation.event}
              guest={invitation.guest}
              visibleStages={invitation.visibleStages}
              initialResponse={invitation.response}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
