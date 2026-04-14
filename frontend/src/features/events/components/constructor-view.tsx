"use client";

import { useState } from "react";
import { SectionLabel } from "@/shared/components/ui";
import { formatDate } from "@/shared/lib/utils";
import type { Language, TemplateStyle } from "@/shared/types/common";
import { defaultConstructorBlocks, type ConstructorBlock } from "@/features/constructor/store";
import type { EventProject } from "@/features/events/types";
import { BlockList } from "@/features/constructor/components/BlockList";
import { StyleSettings } from "@/features/constructor/components/StyleSettings";
import { PageHeader, pageStyle } from "./organizer-ui";

export function ConstructorView({ event }: { event: EventProject }) {
  const [blocks, setBlocks] = useState<ConstructorBlock[]>(defaultConstructorBlocks);
  const [activeStyle, setActiveStyle] = useState<TemplateStyle>(event.templateStyle);
  const [activeLanguage, setActiveLanguage] = useState<Language | "both">("both");
  const [accentColor, setAccentColor] = useState(event.accentColor);
  const sampleStages = event.stages;

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
