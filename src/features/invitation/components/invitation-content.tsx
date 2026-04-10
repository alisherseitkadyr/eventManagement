"use client";

import { useState, useTransition } from "react";
import type { Language, RSVPStatus } from "@/shared/types/common";
import { Button, Card, SectionLabel } from "@/shared/components/ui";
import { Icon } from "@/shared/components/ui/icon";
import { formatDate, getCountdown, t } from "@/shared/lib/utils";
import type { EventProject, EventStage } from "@/features/events/types";
import type { Guest } from "@/features/guests/types";
import { rsvpApi, type RSVPResponse } from "@/features/rsvp/api";

interface InvitationContentProps {
  event: EventProject;
  guest: Guest;
  visibleStages?: EventStage[];
  initialLang?: Language;
  initialResponse?: RSVPResponse | null;
  lang?: Language;
}

function getHeroTitle(event: EventProject, lang: Language): string {
  const title = t(event.title, lang);

  return title
    .replace(/^свадьба\s+/i, "")
    .replace(/^приглашение\s+на\s+/i, "")
    .replace(/\s+тойы$/i, "")
    .trim();
}

function getGreeting(guest: Guest, lang: Language): string {
  if (guest.personalGreeting) {
    return guest.personalGreeting;
  }

  return lang === "ru"
    ? `Дорогие ${guest.name}!`
    : `Құрметті ${guest.name}!`;
}

function getStageLabel(stage: EventStage, lang: Language): string {
  return t(stage.name, lang);
}

export function InvitationContent({
  event,
  guest,
  visibleStages,
  initialLang = "ru",
  initialResponse,
  lang: controlledLang,
}: InvitationContentProps) {
  const lang = controlledLang ?? initialLang;
  const stages = visibleStages?.length ? visibleStages : event.stages;
  const countdown = getCountdown(stages[0]?.date ?? event.createdAt);

  const [status, setStatus] = useState<RSVPStatus | null>(initialResponse?.status ?? null);
  const [guestCount, setGuestCount] = useState(initialResponse?.count ?? guest.count ?? 1);
  const [comment, setComment] = useState(initialResponse?.comment ?? "");
  const [response, setResponse] = useState<RSVPResponse | null>(initialResponse ?? null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(
    initialResponse
      ? lang === "ru"
        ? "Ваш ответ уже сохранен."
        : "Жауабыңыз сақталған."
      : null
  );
  const [isPending, startTransition] = useTransition();

  const leadStage = stages[0];
  const heroTitle = getHeroTitle(event, lang);

  const handleSubmit = () => {
    if (!status) {
      return;
    }

    startTransition(async () => {
      const payload = await rsvpApi.submit({
        token: guest.token,
        status,
        count: status === "confirmed" ? guestCount : undefined,
        comment: comment || undefined,
      });

      setResponse(payload);
      setSubmitMessage(
        lang === "ru"
          ? "Спасибо! Ваш ответ сохранен."
          : "Рақмет! Жауабыңыз сақталды."
      );
    });
  };

  return (
    <div style={{ background: "var(--white)", borderRadius: 20, overflow: "hidden" }}>
      <div
        style={{
          background:
            "linear-gradient(180deg, var(--burgundy-deep) 0%, var(--burgundy) 100%)",
          padding: "4rem 2rem 3rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(220,198,154,0.56)",
              marginBottom: 16,
            }}
          >
            {lang === "ru" ? "Приглашение на свадьбу" : "Тойға шақыру"}
          </div>

          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              color: "var(--gold-light)",
              fontWeight: 300,
              lineHeight: 1.15,
            }}
          >
            {heroTitle || t(event.title, lang)}
          </div>

          <div
            style={{
              width: 40,
              height: 1,
              background: "rgba(220,198,154,0.25)",
              margin: "1.5rem auto",
            }}
          />

          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.46)",
            }}
          >
            {leadStage ? `${formatDate(leadStage.date, lang)} · ${leadStage.time}` : formatDate(event.createdAt, lang)}
          </div>
        </div>
      </div>

      <div style={{ padding: "1.75rem", textAlign: "center", background: "var(--cream)" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            color: "var(--charcoal)",
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          {getGreeting(guest, lang)}
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--warm-gray)" }}>
          {t(event.description ?? event.title, lang)}
        </p>
      </div>

      <div style={{ padding: "1.4rem 1.5rem", textAlign: "center" }}>
        <SectionLabel>{lang === "ru" ? "До события осталось" : "Тойға дейін"}</SectionLabel>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 12 }}>
          {[
            [String(countdown.days), lang === "ru" ? "дней" : "күн"],
            [String(countdown.hours), lang === "ru" ? "часов" : "сағат"],
            [String(countdown.minutes), lang === "ru" ? "минут" : "минут"],
          ].map(([value, label]) => (
            <div
              key={label}
              style={{
                background: "var(--ivory)",
                borderRadius: 12,
                padding: "0.65rem 0.95rem",
                minWidth: 70,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 30,
                  lineHeight: 1,
                  color: "var(--burgundy)",
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: 9, color: "var(--warm-gray)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "1.5rem 1.75rem", background: "var(--ivory)" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <SectionLabel>{lang === "ru" ? "Программа" : "Бағдарлама"}</SectionLabel>
        </div>

        {stages.map((stage, index) => (
          <div
            key={stage.id}
            style={{
              display: "flex",
              gap: 14,
              padding: "0.9rem 0",
              borderBottom:
                index < stages.length - 1 ? "1px solid var(--sand)" : "none",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background:
                  index === 0
                    ? "linear-gradient(135deg, var(--burgundy), var(--burgundy-deep))"
                    : index === 1
                      ? "linear-gradient(135deg, var(--gold), var(--terra))"
                      : "linear-gradient(135deg, var(--terra), var(--burgundy))",
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

            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--charcoal)" }}>
                {getStageLabel(stage, lang)}
              </div>
              <div style={{ fontSize: 12, color: "var(--warm-gray)", marginTop: 2 }}>
                {formatDate(stage.date, lang)} · {stage.time}
              </div>
              <div style={{ fontSize: 12, color: "var(--warm-gray)", marginTop: 2 }}>
                {stage.place}
              </div>
              <div style={{ fontSize: 12, color: "var(--warm-gray)" }}>{stage.address}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "1.5rem 1.75rem" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <SectionLabel>{lang === "ru" ? "Как добраться" : "Жол көрсеткіш"}</SectionLabel>
        </div>

        <Card
          style={{
            background:
              "radial-gradient(circle at top right, rgba(201,169,110,0.18), transparent 35%), var(--ivory)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 8,
              minHeight: 148,
            }}
          >
            <Icon name="map" size={28} color="var(--warm-gray)" />
            <div style={{ fontSize: 13, color: "var(--charcoal)" }}>
              {leadStage?.place ?? event.title.ru}
            </div>
            <div style={{ fontSize: 12, color: "var(--warm-gray)" }}>
              {leadStage?.address ?? "Google Maps / 2GIS"}
            </div>
          </div>
        </Card>
      </div>

      {event.dressCode ? (
        <div style={{ padding: "0 1.75rem 1.5rem" }}>
          <Card
            style={{
              background:
                "linear-gradient(180deg, rgba(201,169,110,0.09) 0%, rgba(255,255,255,0.96) 100%)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <SectionLabel>{lang === "ru" ? "Дресс-код" : "Дресс-код"}</SectionLabel>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  color: "var(--charcoal)",
                  marginTop: 10,
                  marginBottom: 8,
                }}
              >
                {lang === "ru" ? "Поддержите настроение вечера" : "Кештің сәнін қолдаңыз"}
              </div>
              <p style={{ fontSize: 13, color: "var(--warm-gray)", lineHeight: 1.7 }}>
                {t(event.dressCode, lang)}
              </p>
            </div>
          </Card>
        </div>
      ) : null}

      <div style={{ padding: "1.75rem", textAlign: "center", background: "var(--cream)" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 500,
            color: "var(--charcoal)",
            marginBottom: 6,
          }}
        >
          {lang === "ru" ? "Подтвердите участие" : "Қатысуыңызды растаңыз"}
        </div>
        <p style={{ fontSize: 12, color: "var(--warm-gray)", marginBottom: 16 }}>
          {lang === "ru"
            ? "Выберите ответ и при необходимости укажите количество гостей."
            : "Жауабыңызды таңдап, қажет болса қонақ санын көрсетіңіз."}
        </p>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            ["confirmed", lang === "ru" ? "Буду" : "Келемін", "var(--burgundy)", "var(--white)"],
            ["declined", lang === "ru" ? "Не смогу" : "Келе алмаймын", "var(--ivory)", "var(--charcoal-soft)"],
            ["maybe", lang === "ru" ? "Под вопросом" : "Ойланып жатырмын", "var(--ivory)", "var(--charcoal-soft)"],
          ].map(([value, label, bg, color]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value as RSVPStatus)}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: 100,
                border:
                  status === value
                    ? "2px solid var(--burgundy)"
                    : "2px solid transparent",
                background: status === value ? "var(--burgundy)" : bg,
                color: status === value ? "var(--white)" : color,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 200ms",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {status === "confirmed" ? (
          <div
            style={{
              background: "var(--white)",
              borderRadius: 14,
              padding: "1rem",
              border: "1px solid var(--sand)",
              marginTop: 16,
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--charcoal-soft)" }}>
              {lang === "ru" ? "Сколько человек придет?" : "Неше адам келеді?"}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                justifyContent: "center",
                margin: "0.9rem 0 1rem",
              }}
            >
              <button
                type="button"
                onClick={() => setGuestCount((current) => Math.max(1, current - 1))}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid var(--sand)",
                  background: "var(--white)",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                −
              </button>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 30,
                  color: "var(--burgundy)",
                  minWidth: 48,
                  textAlign: "center",
                }}
              >
                {guestCount}
              </span>
              <button
                type="button"
                onClick={() => setGuestCount((current) => current + 1)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid var(--sand)",
                  background: "var(--white)",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                +
              </button>
            </div>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder={
                lang === "ru"
                  ? "Комментарий для организатора"
                  : "Ұйымдастырушыға пікір"
              }
              style={{
                width: "100%",
                minHeight: 72,
                resize: "vertical",
                borderRadius: 12,
                border: "1.5px solid var(--sand)",
                padding: "0.75rem 0.85rem",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--charcoal)",
                background: "var(--white)",
              }}
            />
          </div>
        ) : null}

        <Button
          type="button"
          variant="primary"
          fullWidth
          loading={isPending}
          disabled={!status}
          onClick={handleSubmit}
          style={{ justifyContent: "center", marginTop: 14 }}
        >
          {lang === "ru" ? "Сохранить ответ" : "Жауапты сақтау"}
        </Button>

        {submitMessage ? (
          <div
            style={{
              marginTop: 14,
              padding: "0.8rem 0.95rem",
              borderRadius: 12,
              background: "var(--success-bg)",
              color: "var(--success)",
              fontSize: 12.5,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="check" size={14} color="currentColor" />
            {submitMessage}
          </div>
        ) : null}

        {response?.comment && status !== "confirmed" ? (
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--warm-gray)" }}>
            {response.comment}
          </div>
        ) : null}
      </div>

      <div style={{ padding: "1.4rem 1.75rem 2rem", textAlign: "center" }}>
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>{lang === "ru" ? "Координатор" : "Үйлестіруші"}</SectionLabel>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--charcoal)" }}>
          {event.coordinatorName}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--warm-gray)", marginTop: 4 }}>
          {event.coordinatorPhone}
        </div>
      </div>
    </div>
  );
}
