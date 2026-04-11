"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui";
import { Icon } from "@/shared/components/ui/icon";
import { eventTypeLabels, eventTypeEmojis } from "@/shared/lib/utils";
import type { EventType, TemplateStyle, Language } from "@/shared/types/common";
import { eventsApi } from "@/features/events/api";

// ─── Step definitions ───────────────────────────────────────────────────────

const STEPS = ["Тип события", "Детали", "Шаблон"] as const;

const EVENT_TYPES: EventType[] = [
  "wedding",
  "qyz_uzatu",
  "betashar",
  "qudalyq",
  "anniversary",
  "sundet_toi",
  "birthday",
  "tusau_kesu",
  "other",
];

const TEMPLATE_OPTIONS: Array<{ value: TemplateStyle; label: string; description: string }> = [
  { value: "elegant", label: "Elegant", description: "Утончённый минимализм с золотыми акцентами" },
  { value: "modern", label: "Modern", description: "Современный и чистый дизайн" },
  { value: "national", label: "National", description: "Казахские орнаменты и традиционные цвета" },
];

// ─── Shared styles ───────────────────────────────────────────────────────────

const shell: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(201,169,110,0.14), transparent 28%), linear-gradient(180deg, var(--cream) 0%, #f8f0e8 100%)",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  padding: "3rem 1.25rem 4rem",
};

const card: CSSProperties = {
  width: "100%",
  maxWidth: 680,
  background: "var(--white)",
  borderRadius: 24,
  border: "1px solid var(--sand)",
  padding: "2.5rem",
  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function NewEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [eventType, setEventType] = useState<EventType>("wedding");
  const [titleRu, setTitleRu] = useState("");
  const [titleKz, setTitleKz] = useState("");
  const [languages, setLanguages] = useState<Language[]>(["ru", "kz"]);
  const [template, setTemplate] = useState<TemplateStyle>("elegant");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleLang = (lang: Language) => {
    setLanguages((prev) =>
      prev.includes(lang)
        ? prev.length > 1
          ? prev.filter((l) => l !== lang)
          : prev
        : [...prev, lang]
    );
  };

  const handleCreate = async () => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const event = await eventsApi.create({
        type: eventType,
        title: { ru: titleRu || eventTypeLabels[eventType].ru, kz: titleKz || eventTypeLabels[eventType].kz },
        templateStyle: template,
        languages,
      });
      router.push(`/events/${event.id}`);
    } catch {
      setErrorMessage("Создание событий заработает после подключения backend и включения backend mode.");
      setSubmitting(false);
    }
  };

  return (
    <div style={shell}>
      <div style={card}>
        {/* Logo */}
        <div style={{ marginBottom: "2rem" }}>
          <a
            href="/dashboard"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--burgundy)",
              textDecoration: "none",
            }}
          >
            Qona<span style={{ color: "var(--gold)" }}>q</span>
          </a>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: "2rem" }}>
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: i < step ? "var(--success)" : i === step ? "var(--burgundy)" : "var(--sand)",
                  color: i <= step ? "var(--white)" : "var(--warm-gray)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {i < step ? <Icon name="check" size={13} color="currentColor" /> : i + 1}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: i === step ? 600 : 400,
                  color: i === step ? "var(--charcoal)" : "var(--warm-gray)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div style={{ width: 24, height: 1, background: "var(--sand)", flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {errorMessage ? (
          <div
            style={{
              marginBottom: "1.25rem",
              padding: "0.85rem 1rem",
              borderRadius: 14,
              background: "var(--warning-bg)",
              color: "var(--charcoal-soft)",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {errorMessage}
          </div>
        ) : null}

        {/* Step 0 — Event type */}
        {step === 0 && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 30,
                fontWeight: 300,
                color: "var(--charcoal)",
                marginBottom: 6,
              }}
            >
              Какое событие планируете?
            </h1>
            <p style={{ fontSize: 14, color: "var(--warm-gray)", marginBottom: "1.75rem" }}>
              Выберите тип — это поможет настроить шаблон и подсказки.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 10,
              }}
            >
              {EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventType(type)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "0.85rem 1rem",
                    borderRadius: 14,
                    border:
                      eventType === type
                        ? "1.5px solid var(--burgundy)"
                        : "1.5px solid var(--sand)",
                    background: eventType === type ? "var(--gold-faint)" : "var(--white)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{eventTypeEmojis[type]}</span>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: eventType === type ? "var(--burgundy)" : "var(--charcoal)",
                      }}
                    >
                      {eventTypeLabels[type].ru}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--warm-gray)" }}>
                      {eventTypeLabels[type].kz}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.75rem" }}>
              <Button variant="primary" onClick={() => setStep(1)}>
                Далее
                <Icon name="chevron-right" size={16} color="currentColor" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 1 — Details */}
        {step === 1 && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 30,
                fontWeight: 300,
                color: "var(--charcoal)",
                marginBottom: 6,
              }}
            >
              Детали события
            </h1>
            <p style={{ fontSize: 14, color: "var(--warm-gray)", marginBottom: "1.75rem" }}>
              Введите название и выберите языки приглашений.
            </p>

            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--charcoal-soft)",
                    marginBottom: 6,
                  }}
                >
                  Название (рус)
                </label>
                <input
                  value={titleRu}
                  onChange={(e) => setTitleRu(e.target.value)}
                  placeholder={eventTypeLabels[eventType].ru}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: 12,
                    border: "1.5px solid var(--sand)",
                    fontSize: 14,
                    fontFamily: "var(--font-body)",
                    background: "var(--white)",
                    color: "var(--charcoal)",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--charcoal-soft)",
                    marginBottom: 6,
                  }}
                >
                  Атауы (қаз)
                </label>
                <input
                  value={titleKz}
                  onChange={(e) => setTitleKz(e.target.value)}
                  placeholder={eventTypeLabels[eventType].kz}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: 12,
                    border: "1.5px solid var(--sand)",
                    fontSize: 14,
                    fontFamily: "var(--font-body)",
                    background: "var(--white)",
                    color: "var(--charcoal)",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--charcoal-soft)",
                    marginBottom: 8,
                  }}
                >
                  Языки приглашений
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["ru", "kz"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLang(lang)}
                      style={{
                        padding: "0.6rem 1.4rem",
                        borderRadius: 100,
                        border: languages.includes(lang)
                          ? "1.5px solid var(--burgundy)"
                          : "1.5px solid var(--sand)",
                        background: languages.includes(lang) ? "var(--burgundy)" : "transparent",
                        color: languages.includes(lang) ? "var(--white)" : "var(--charcoal-soft)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {lang === "ru" ? "Русский" : "Қазақша"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.75rem" }}>
              <Button variant="ghost" onClick={() => setStep(0)}>
                <Icon name="chevron-left" size={16} color="currentColor" />
                Назад
              </Button>
              <Button variant="primary" onClick={() => setStep(2)}>
                Далее
                <Icon name="chevron-right" size={16} color="currentColor" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 — Template */}
        {step === 2 && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 30,
                fontWeight: 300,
                color: "var(--charcoal)",
                marginBottom: 6,
              }}
            >
              Выберите шаблон
            </h1>
            <p style={{ fontSize: 14, color: "var(--warm-gray)", marginBottom: "1.75rem" }}>
              Стиль можно изменить позже в конструкторе.
            </p>

            <div style={{ display: "grid", gap: 12 }}>
              {TEMPLATE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTemplate(opt.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "1.1rem 1.25rem",
                    borderRadius: 16,
                    border:
                      template === opt.value
                        ? "1.5px solid var(--burgundy)"
                        : "1.5px solid var(--sand)",
                    background: template === opt.value ? "var(--gold-faint)" : "var(--white)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-body)",
                    width: "100%",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color:
                          template === opt.value ? "var(--burgundy)" : "var(--charcoal)",
                        marginBottom: 4,
                      }}
                    >
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--warm-gray)" }}>
                      {opt.description}
                    </div>
                  </div>
                  {template === opt.value && (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "var(--burgundy)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name="check" size={13} color="var(--white)" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.75rem" }}>
              <Button variant="ghost" onClick={() => setStep(1)}>
                <Icon name="chevron-left" size={16} color="currentColor" />
                Назад
              </Button>
              <Button variant="gold" loading={submitting} onClick={handleCreate}>
                Создать событие
                <Icon name="check" size={16} color="currentColor" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
