"use client";

import React, { useState } from "react";
import type { EventProject } from "@/features/events/types";
import type { Guest } from "@/features/guests/types";
import type { Language } from "@/shared/types/common";
import type { ConstructorBlock } from "@/features/constructor/store";
import { formatDate, getCountdown } from "@/shared/lib/utils";
import { Icon } from "@/shared/components/ui/icon";
import styles from "./invitationRenderer.module.css";

interface InvitationRendererProps {
  event: EventProject;
  guest?: Guest;
  lang: Language;
  blocks?: ConstructorBlock[];
  onRsvp?: (status: "confirmed" | "declined" | "maybe", count?: number, comment?: string) => void;
  isPreview?: boolean;
}

export function InvitationRenderer({ event, guest, lang, blocks, onRsvp, isPreview }: InvitationRendererProps) {
  const [rsvp, setRsvp] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(guest?.count || 2);
  const [comment, setComment] = useState("");
  const countdown = getCountdown(event.stages[0]?.date || "2026-07-15");

  const isBlockEnabled = (type: string) => {
    if (!blocks) return true;
    const block = blocks.find((b) => b.id === type);
    return block ? block.enabled : true;
  };

  const t = (text: { ru: string; kz: string }) => text[lang];

  const visibleStages = guest
    ? event.stages.filter((s) => guest.assignedStageIds.includes(s.id))
    : event.stages;

  const stageGradients = [
    "linear-gradient(135deg, var(--burgundy), var(--burgundy-deep))",
    "linear-gradient(135deg, var(--gold), var(--terra))",
    "linear-gradient(135deg, var(--terra), var(--burgundy))",
  ];

  return (
    <div className={styles.invitation}>
      {/* Cover */}
      {isBlockEnabled("cover") && (
        <div className={styles.cover}>
          <div className={styles.coverPattern} />
          <div className={styles.coverContent}>
            <div className={styles.coverLabel}>
              {lang === "ru" ? "Приглашение на свадьбу" : "Тойға шақыру"}
            </div>
            {isBlockEnabled("names") && (
              <>
                <div className={styles.coverNames}>
                  Айдана<br />
                  <span className={styles.coverAmp}>&</span><br />
                  {lang === "kz" ? "Нұрлан" : "Нурлан"}
                </div>
                <div className={styles.coverDivider} />
                <div className={styles.coverDate}>
                  15 · {lang === "ru" ? "ИЮЛЯ" : "ШІЛДЕ"} · 2026 · {lang === "ru" ? "АСТАНА" : "АСТАНА"}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Personal greeting */}
      {isBlockEnabled("story") && (
        <div className={styles.section} style={{ background: "var(--cream)", textAlign: "center" }}>
          <div className={styles.greeting}>
            {guest
              ? `${lang === "ru" ? "Құрметті" : "Құрметті"} ${guest.personalGreeting || guest.name}!`
              : `${lang === "ru" ? "Дорогие гости!" : "Құрметті қонақтар!"}`}
          </div>
          <p className={styles.storyText}>
            {event.description ? t(event.description) : ""}
          </p>
        </div>
      )}

      {/* Countdown */}
      {isBlockEnabled("countdown") && (
        <div className={styles.section} style={{ textAlign: "center" }}>
          <div className={styles.sectionLabel}>
            {lang === "ru" ? "До события осталось" : "Тойға дейін"}
          </div>
          <div className={styles.countdownGrid}>
            {[
              { val: countdown.days, label: lang === "ru" ? "дней" : "күн" },
              { val: countdown.hours, label: lang === "ru" ? "часов" : "сағат" },
              { val: countdown.minutes, label: lang === "ru" ? "минут" : "минут" },
            ].map((item) => (
              <div key={item.label} className={styles.countdownCell}>
                <div className={styles.countdownValue}>{item.val}</div>
                <div className={styles.countdownLabel}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Program */}
      {isBlockEnabled("program") && visibleStages.length > 0 && (
        <div className={styles.section} style={{ background: "var(--ivory)" }}>
          <div className={styles.sectionLabel} style={{ textAlign: "center", marginBottom: 14 }}>
            {lang === "ru" ? "Программа" : "Бағдарлама"}
          </div>
          {visibleStages.map((stage, i) => (
            <div key={stage.id} className={styles.programItem} style={{
              borderBottom: i < visibleStages.length - 1 ? "1px solid var(--sand)" : "none",
            }}>
              <div className={styles.programIcon} style={{ background: stageGradients[i % 3] }}>
                {stage.emoji || "📌"}
              </div>
              <div className={styles.programInfo}>
                <div className={styles.programName}>{t(stage.name)}</div>
                <div className={styles.programMeta}>
                  {formatDate(stage.date, lang)} · {stage.time}
                </div>
                <div className={styles.programMeta}>{stage.place}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dress code */}
      {isBlockEnabled("dresscode") && event.dressCode && (
        <div className={styles.section} style={{ textAlign: "center" }}>
          <div className={styles.sectionLabel}>
            {lang === "ru" ? "Дресс-код" : "Дресс-код"}
          </div>
          <p className={styles.storyText}>{t(event.dressCode)}</p>
        </div>
      )}

      {/* Map */}
      {isBlockEnabled("map") && (
        <div className={styles.section}>
          <div className={styles.sectionLabel} style={{ textAlign: "center", marginBottom: 10 }}>
            {lang === "ru" ? "Как добраться" : "Жол көрсеткіш"}
          </div>
          <div className={styles.mapPlaceholder}>
            <Icon name="map" size={28} color="var(--warm-gray)" />
            <span>Google Maps / 2GIS</span>
          </div>
        </div>
      )}

      {/* RSVP */}
      {isBlockEnabled("rsvp") && (
        <div className={styles.section} style={{ background: "var(--cream)", textAlign: "center" }}>
          <div className={styles.greeting} style={{ marginBottom: 6 }}>
            {lang === "ru" ? "Подтвердите участие" : "Қатысуыңызды растаңыз"}
          </div>
          <p className={styles.storyText} style={{ marginBottom: 16 }}>
            {lang === "ru"
              ? "Нажмите кнопку и укажите количество гостей"
              : "Батырманы басып, қонақтар санын көрсетіңіз"}
          </p>
          <div className={styles.rsvpButtons}>
            {([
              { key: "confirmed", label: lang === "ru" ? "Буду" : "Келемін" },
              { key: "declined", label: lang === "ru" ? "Не смогу" : "Келе алмаймын" },
              { key: "maybe", label: "🤔" },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                className={`${styles.rsvpBtn} ${rsvp === opt.key ? styles.rsvpBtnActive : ""}`}
                onClick={() => setRsvp(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {rsvp === "confirmed" && (
            <div className={styles.rsvpForm}>
              <label className={styles.rsvpFormLabel}>
                {lang === "ru" ? "Сколько человек придёт?" : "Неше адам келеді?"}
              </label>
              <div className={styles.counter}>
                <button className={styles.counterBtn} onClick={() => setGuestCount(Math.max(1, guestCount - 1))}>−</button>
                <span className={styles.counterValue}>{guestCount}</span>
                <button className={styles.counterBtn} onClick={() => setGuestCount(guestCount + 1)}>+</button>
              </div>
              <textarea
                className={styles.rsvpTextarea}
                placeholder={lang === "ru" ? "Комментарий (необязательно)" : "Пікір (міндетті емес)"}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className={styles.rsvpSubmit}
                onClick={() => onRsvp?.("confirmed", guestCount, comment)}
              >
                {lang === "ru" ? "Подтвердить" : "Растау"} ✓
              </button>
            </div>
          )}
        </div>
      )}

      {/* Contacts */}
      {isBlockEnabled("contacts") && (
        <div className={styles.section} style={{ textAlign: "center", paddingBottom: "2rem" }}>
          <div className={styles.sectionLabel}>
            {lang === "ru" ? "Координатор" : "Үйлестіруші"}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--charcoal)", marginTop: 8 }}>
            {event.coordinatorName}
          </div>
          <div style={{ fontSize: 12, color: "var(--warm-gray)" }}>
            {event.coordinatorPhone}
          </div>
        </div>
      )}
    </div>
  );
}