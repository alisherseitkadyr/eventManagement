"use client";

import { useState } from "react";
import { Avatar, Badge, Button, Card } from "@/shared/components/ui";
import { Icon } from "@/shared/components/ui/icon";
import { formatDate, rsvpStatusConfig, rsvpStatusLabels } from "@/shared/lib/utils";
import type { Language, RSVPStatus } from "@/shared/types/common";
import type { EventProject, EventStats } from "@/features/events/types";
import type { Guest } from "@/features/guests/types";
import { buildClientInvitationUrl, buildInvitationUrl } from "@/features/invitation/api";
import { PageHeader, pageStyle } from "./organizer-ui";

function StatusPill({ status, lang = "ru" }: { status: RSVPStatus; lang?: Language }) {
  const config = rsvpStatusConfig[status];
  return (
    <Badge bg={config.bg} color={config.color}>
      {rsvpStatusLabels[status][lang]}
    </Badge>
  );
}

function buildShareMessage(event: EventProject, invitationUrl: string): string {
  return `Ассалаумағалейкум! 🤍

Рады пригласить вас на ${event.title.ru.toLowerCase()}.

📅 ${formatDate(event.stages[0]?.date ?? event.createdAt, "ru")}
📍 ${event.stages[0]?.place ?? "Казахстан"}

Подробности и подтверждение по ссылке:
${invitationUrl}`;
}

export function SendingView({
  event,
  guests,
  stats,
}: {
  event: EventProject;
  guests: Guest[];
  stats: EventStats;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messageCopied, setMessageCopied] = useState(false);
  const hasGuests = guests.length > 0;
  const pendingGuests = guests.filter((guest) => guest.status === "pending");
  const openedCount = guests.filter((guest) => guest.openedAt).length;
  const shareLink = buildInvitationUrl(guests[0]?.token ?? "demo");
  const shareMessage = hasGuests
    ? buildShareMessage(event, shareLink)
    : "Добавьте хотя бы одного гостя, чтобы получить персональную ссылку для рассылки.";

  const openShare = (network: "whatsapp" | "telegram") => {
    if (!hasGuests) {
      return;
    }

    const absoluteShareLink = buildClientInvitationUrl(guests[0]?.token ?? "demo");
    const absoluteShareMessage = buildShareMessage(event, absoluteShareLink);
    const encoded = encodeURIComponent(absoluteShareMessage);
    const url =
      network === "whatsapp"
        ? `https://wa.me/?text=${encoded}`
        : `https://t.me/share/url?url=${encodeURIComponent(absoluteShareLink)}&text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={pageStyle}>
      <PageHeader
        title={
          <>
            Рассылка <span style={{ fontStyle: "italic", color: "var(--burgundy)" }}>приглашений</span>
          </>
        }
        subtitle="Отправьте персональные ссылки через мессенджеры или скопируйте готовый текст"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <Card>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500, marginBottom: 16 }}>
            Быстрая отправка
          </h3>

          <div
            style={{
              background: "var(--ivory)",
              borderRadius: 14,
              padding: "1rem",
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--charcoal-soft)", marginBottom: 8 }}>
              Текст сообщения
            </div>
            <textarea
              readOnly
              value={shareMessage}
              style={{
                width: "100%",
                minHeight: 124,
                resize: "none",
                padding: "0.8rem 0.85rem",
                borderRadius: 12,
                border: "1.5px solid var(--sand)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                lineHeight: 1.6,
                background: "var(--white)",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button
              variant="primary"
              style={{ flex: 1, justifyContent: "center", background: "#25D366" }}
              disabled={!hasGuests}
              onClick={() => openShare("whatsapp")}
            >
              <Icon name="whatsapp" size={16} color="currentColor" />
              WhatsApp
            </Button>
            <Button
              variant="primary"
              style={{ flex: 1, justifyContent: "center", background: "#0088cc" }}
              disabled={!hasGuests}
              onClick={() => openShare("telegram")}
            >
              <Icon name="telegram" size={16} color="currentColor" />
              Telegram
            </Button>
            <Button
              variant="ghost"
              style={{ flex: 1, justifyContent: "center" }}
              disabled={!hasGuests}
              onClick={() => {
                navigator.clipboard.writeText(
                  buildShareMessage(event, buildClientInvitationUrl(guests[0]?.token ?? "demo"))
                );
                setMessageCopied(true);
                window.setTimeout(() => setMessageCopied(false), 1600);
              }}
            >
              <Icon name={messageCopied ? "check" : "copy"} size={14} color="currentColor" />
              {messageCopied ? "Скопировано" : "Копировать"}
            </Button>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500, marginBottom: 16 }}>
            Статистика доставки
          </h3>
          {[
            { label: "Ссылки созданы", value: guests.length, color: "var(--charcoal)" },
            { label: "Открыли ссылку", value: openedCount, color: "var(--info)" },
            { label: "Подтвердили", value: stats.confirmed, color: "var(--success)" },
            { label: "Не открыли", value: guests.length - openedCount, color: "var(--warm-gray)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 0",
                borderBottom: "1px solid var(--sand-light)",
              }}
            >
              <span style={{ fontSize: 13.5, color: "var(--charcoal-soft)" }}>{label}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 24, color }}>{value}</span>
            </div>
          ))}

          <Button
            variant="sm"
            style={{ width: "100%", justifyContent: "center", marginTop: 14 }}
          >
            <Icon name="bell" size={14} color="currentColor" />
            Напомнить неответившим ({pendingGuests.length})
          </Button>
        </Card>
      </div>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500 }}>
            Персональные ссылки
          </h3>
          <Button variant="sm">
            <Icon name="download" size={14} color="currentColor" />
            PDF всех приглашений
          </Button>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {guests.length === 0 ? (
            <div
              style={{
                padding: "1rem 0.8rem",
                borderRadius: 12,
                background: "var(--ivory)",
                fontSize: 13,
                color: "var(--warm-gray)",
              }}
            >
              Добавьте гостей, чтобы сгенерировать персональные ссылки для рассылки.
            </div>
          ) : (
            guests.map((guest) => (
              <div
                key={guest.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "0.7rem 0.8rem",
                  background: "var(--ivory)",
                  borderRadius: 12,
                  flexWrap: "wrap",
                }}
              >
                <Avatar name={guest.name} size={32} />
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--charcoal)" }}>
                    {guest.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--warm-gray)",
                      fontFamily: "monospace",
                      marginTop: 2,
                    }}
                  >
                    {buildInvitationUrl(guest.token)}
                  </div>
                </div>
                <StatusPill status={guest.status} />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(buildClientInvitationUrl(guest.token));
                    setCopiedId(guest.id);
                    window.setTimeout(() => setCopiedId(null), 1600);
                  }}
                  style={{
                    background: copiedId === guest.id ? "var(--success-bg)" : "var(--gold-faint)",
                    color: copiedId === guest.id ? "var(--success)" : "var(--burgundy)",
                    border: "none",
                    borderRadius: 10,
                    padding: "0.45rem 0.7rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <Icon
                    name={copiedId === guest.id ? "check" : "copy"}
                    size={12}
                    color="currentColor"
                  />
                  {copiedId === guest.id ? "Скопировано" : "Копировать"}
                </button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
