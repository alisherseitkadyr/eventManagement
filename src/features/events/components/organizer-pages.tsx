"use client";

import type { CSSProperties, ReactNode } from "react";
import { useDeferredValue, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Badge,
  Button,
  Card,
  SectionLabel,
  SectionTitle,
} from "@/shared/components/ui";
import { Icon } from "@/shared/components/ui/icon";
import {
  formatDate,
  guestSideLabels,
  pluralize,
  rsvpStatusConfig,
  rsvpStatusLabels,
  t,
} from "@/shared/lib/utils";
import type { Language, RSVPStatus, TemplateStyle } from "@/shared/types/common";
import {
  defaultConstructorBlocks,
  type ConstructorBlock,
} from "@/features/constructor/store";
import type { EventProject, EventStage, EventStats } from "@/features/events/types";
import type { Guest } from "@/features/guests/types";
import { buildClientInvitationUrl, buildInvitationUrl } from "@/features/invitation/api";
import { InvitationContent } from "@/features/invitation/components/invitation-content";
import { StatsGrid } from "./StatsGrid";
import { StagesList } from "./StagesList";
import { RecentResponses } from "./RecentResponses";
import { RSVPProgressBar } from "./RSVPProgressBar";
import { BlockList } from "@/features/constructor/components/BlockList";
import { StyleSettings } from "@/features/constructor/components/StyleSettings";

const pageStyle: CSSProperties = {
  padding: "clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2.5rem)",
  maxWidth: 1180,
};

const subheadStyle: CSSProperties = {
  fontSize: 14,
  color: "var(--warm-gray)",
  marginTop: 6,
};

const tableHeadStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "var(--warm-gray)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  padding: "0.75rem 1rem",
  textAlign: "left",
  borderBottom: "1px solid var(--sand)",
  background: "var(--ivory)",
};

const tableCellStyle: CSSProperties = {
  padding: "0.95rem 1rem",
  borderBottom: "1px solid var(--sand-light)",
  fontSize: 13.5,
  color: "var(--charcoal)",
  verticalAlign: "middle",
};

function getVisibleStages(event: EventProject, guest?: Guest): EventStage[] {
  if (!guest || guest.assignedStageIds.length === 0) {
    return event.stages;
  }

  return event.stages.filter((stage) => guest.assignedStageIds.includes(stage.id));
}

function getGuestSubtitle(guest: Guest, lang: Language): string {
  const guestWord = pluralize(guest.count, ["человек", "человека", "человек"]);
  return `${guest.count} ${guestWord} · ${guestSideLabels[guest.side][lang]}`;
}

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

function PageHeader({
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

function StatusPill({ status, lang = "ru" }: { status: RSVPStatus; lang?: Language }) {
  const config = rsvpStatusConfig[status];
  return (
    <Badge bg={config.bg} color={config.color}>
      {rsvpStatusLabels[status][lang]}
    </Badge>
  );
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
        title={
          <>
            {event.title.ru}{" "}
            <span style={{ color: "var(--burgundy)", fontStyle: "italic" }}>MVP</span>
          </>
        }
        subtitle={`${formatDate(event.stages[0]?.date ?? event.createdAt, "ru")} · ${event.stages.length} этапа · ${event.stages[0]?.place ?? "Казахстан"}`}
        actions={
          <>
            <Link href={`/events/${event.id}/sending`} style={linkButtonStyle("ghost")}>
              <Icon name="download" size={15} color="currentColor" />
              Экспорт
            </Link>
            <Link href={`/events/${event.id}/sending`} style={linkButtonStyle("primary")}>
              <Icon name="send" size={15} color="currentColor" />
              Разослать
            </Link>
          </>
        }
      />


      <StatsGrid stats={stats} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
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
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 500,
              color: "var(--charcoal)",
              marginBottom: 16,
            }}
          >
            Этапы события
          </h3>
          <StagesList stages={event.stages} />
          <Button
            variant="sm"
            style={{ width: "100%", justifyContent: "center", marginTop: 14 }}
          >
            <Icon name="plus" size={14} color="currentColor" />
            Добавить этап
          </Button>
        </Card>
      </div>

      <Card style={{ marginTop: 20 }}>
        <RSVPProgressBar stats={stats} />
      </Card>
    </div>
  );
}


export function ConstructorView({
  event,
  guests,
}: {
  event: EventProject;
  guests: Guest[];
}) {
  const [blocks, setBlocks] = useState<ConstructorBlock[]>(defaultConstructorBlocks);
  const [activeStyle, setActiveStyle] = useState<TemplateStyle>(event.templateStyle);
  const [activeLanguage, setActiveLanguage] = useState<Language | "both">("both");
  const [accentColor, setAccentColor] = useState(event.accentColor);
  const sampleGuest = guests[0];
  const sampleStages = getVisibleStages(event, sampleGuest);

  const toggleBlock = (blockId: ConstructorBlock["id"]) => {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId ? { ...block, enabled: !block.enabled } : block
      )
    );
  };

  return (
    <div style={pageStyle}>
      <PageHeader
        title={
          <>
            Конструктор <span style={{ fontStyle: "italic", color: "var(--burgundy)" }}>приглашения</span>
          </>
        }
        subtitle="Включайте, отключайте и настраивайте блоки страницы под MVP"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div>
          <BlockList blocks={blocks} onToggle={toggleBlock} />
          <StyleSettings
            activeStyle={activeStyle}
            activeLanguage={activeLanguage}
            accentColor={accentColor}
            onStyleChange={setActiveStyle}
            onLanguageChange={setActiveLanguage}
            onColorChange={setAccentColor}
          />
        </div>

        <div style={{ position: "sticky", top: "1rem" }}>
          <div
            style={{
              background: "var(--charcoal)",
              borderRadius: 24,
              padding: "12px 12px 16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <div
                style={{
                  width: 100,
                  height: 4,
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.15)",
                }}
              />
            </div>
            <div
              style={{
                background: "var(--white)",
                borderRadius: 16,
                overflow: "hidden",
                maxHeight: 620,
                overflowY: "auto",
              }}
            >
              {blocks.find((block) => block.id === "cover")?.enabled ? (
                <div
                  style={{
                    background: `linear-gradient(180deg, ${accentColor}, var(--burgundy-deep))`,
                    padding: "3rem 2rem 2.5rem",
                    textAlign: "center",
                    color: "var(--white)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(220,198,154,0.64)",
                      marginBottom: 8,
                    }}
                  >
                    {activeStyle === "national" ? "Той" : "Свадьба"}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 30,
                      color: "var(--gold-light)",
                    }}
                  >
                    {event.title.ru.replace(/^Свадьба\s+/i, "")}
                  </div>
                  <div
                    style={{
                      width: 30,
                      height: 1,
                      background: "rgba(220,198,154,0.3)",
                      margin: "1rem auto",
                    }}
                  />
                  <div style={{ fontSize: 11, letterSpacing: "0.16em", color: "rgba(255,255,255,0.56)" }}>
                    {formatDate(event.stages[0]?.date ?? event.createdAt, "ru")}
                  </div>
                </div>
              ) : null}

              {blocks.find((block) => block.id === "countdown")?.enabled ? (
                <div style={{ padding: "1.5rem", textAlign: "center", background: "var(--cream)" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--warm-gray)", marginBottom: 10 }}>
                    До события
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    {[
                      ["82", "дней"],
                      ["14", "часов"],
                      ["32", "минут"],
                    ].map(([value, label]) => (
                      <div key={label}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: accentColor }}>
                          {value}
                        </div>
                        <div style={{ fontSize: 9, color: "var(--warm-gray)", marginTop: 3 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {blocks.find((block) => block.id === "story")?.enabled ? (
                <div style={{ padding: "1.35rem 1.5rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 8 }}>
                    Дорогие гости!
                  </div>
                  <p style={{ fontSize: 12, lineHeight: 1.7, color: "var(--warm-gray)" }}>
                    {event.description?.ru}
                  </p>
                </div>
              ) : null}

              {blocks.find((block) => block.id === "program")?.enabled ? (
                <div style={{ padding: "1.25rem 1.5rem", background: "var(--ivory)" }}>
                  <div style={{ textAlign: "center", marginBottom: 10 }}>
                    <SectionLabel>Программа</SectionLabel>
                  </div>
                  {sampleStages.map((stage) => (
                    <div key={stage.id} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: accentColor, minWidth: 40 }}>
                        {stage.time}
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--charcoal)" }}>
                          {stage.name.ru}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--warm-gray)" }}>{stage.place}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {blocks.find((block) => block.id === "rsvp")?.enabled ? (
                <div style={{ padding: "1.4rem 1.5rem", textAlign: "center" }}>
                  <SectionLabel>Подтвердите участие</SectionLabel>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
                    {["Буду", "Не смогу", "Под вопросом"].map((label, index) => (
                      <button
                        key={label}
                        type="button"
                        style={{
                          padding: "0.55rem 1rem",
                          borderRadius: 100,
                          border: "none",
                          background: index === 0 ? accentColor : "var(--ivory)",
                          color: index === 0 ? "var(--white)" : "var(--charcoal-soft)",
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div style={{ padding: "0 1.5rem 1.5rem", textAlign: "center", color: "var(--warm-gray)", fontSize: 11 }}>
                Режим языка: {activeLanguage === "both" ? "RU + KZ" : activeLanguage.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
  const previewGuest = guests[0];
  const previewStages = getVisibleStages(event, previewGuest);

  return (
    <div style={pageStyle}>
      <PageHeader
        title={
          <>
            Предпросмотр <span style={{ fontStyle: "italic", color: "var(--burgundy)" }}>приглашения</span>
          </>
        }
        subtitle={`Так приглашение увидит гость «${previewGuest.name}»`}
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
              onClick={() => {
                navigator.clipboard.writeText(buildClientInvitationUrl(previewGuest.token));
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1500);
              }}
            >
              <Icon name={copied ? "check" : "copy"} size={14} color="currentColor" />
              {copied ? "Скопировано" : "Скопировать ссылку"}
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
  const pendingGuests = guests.filter((guest) => guest.status === "pending");
  const openedCount = guests.filter((guest) => guest.openedAt).length;
  const shareLink = buildInvitationUrl(guests[0]?.token ?? "demo");
  const shareMessage = `Ассалаумағалейкум! 🤍

Рады пригласить вас на ${event.title.ru.toLowerCase()}.

📅 ${formatDate(event.stages[0]?.date ?? event.createdAt, "ru")}
📍 ${event.stages[0]?.place ?? "Казахстан"}

Подробности и подтверждение по ссылке:
${shareLink}`;

  const openShare = (network: "whatsapp" | "telegram") => {
    const absoluteShareLink = buildClientInvitationUrl(guests[0]?.token ?? "demo");
    const absoluteShareMessage = `Ассалаумағалейкум! 🤍

Рады пригласить вас на ${event.title.ru.toLowerCase()}.

📅 ${formatDate(event.stages[0]?.date ?? event.createdAt, "ru")}
📍 ${event.stages[0]?.place ?? "Казахстан"}

Подробности и подтверждение по ссылке:
${absoluteShareLink}`;
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
              onClick={() => openShare("whatsapp")}
            >
              <Icon name="whatsapp" size={16} color="currentColor" />
              WhatsApp
            </Button>
            <Button
              variant="primary"
              style={{ flex: 1, justifyContent: "center", background: "#0088cc" }}
              onClick={() => openShare("telegram")}
            >
              <Icon name="telegram" size={16} color="currentColor" />
              Telegram
            </Button>
            <Button
              variant="ghost"
              style={{ flex: 1, justifyContent: "center" }}
              onClick={() => {
                navigator.clipboard.writeText(
                  `Ассалаумағалейкум! 🤍

Рады пригласить вас на ${event.title.ru.toLowerCase()}.

📅 ${formatDate(event.stages[0]?.date ?? event.createdAt, "ru")}
📍 ${event.stages[0]?.place ?? "Казахстан"}

Подробности и подтверждение по ссылке:
${buildClientInvitationUrl(guests[0]?.token ?? "demo")}`
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
            {
              label: "Не открыли",
              value: guests.length - openedCount,
              color: "var(--warm-gray)",
            },
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
          {guests.map((guest) => (
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
                  background:
                    copiedId === guest.id ? "var(--success-bg)" : "var(--gold-faint)",
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
          ))}
        </div>
      </Card>
    </div>
  );
}
