// ═══════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Language, RSVPStatus, GuestSide, EventType, LocalizedText } from "@/shared/types/common";

/**
 * Merge Tailwind classes safely
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Get localized text
 */
export function t(text: LocalizedText, lang: Language): string {
  return text[lang];
}

/**
 * Format date in localized style
 */
export function formatDate(date: string | Date, lang: Language): string {
  const d = new Date(date);
  const months: Record<Language, string[]> = {
    ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    kz: ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"],
  };
  return `${d.getDate()} ${months[lang][d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Format time
 */
export function formatTime(time: string): string {
  return time;
}

/**
 * Get countdown to a date
 */
export function getCountdown(date: string | Date): { days: number; hours: number; minutes: number } {
  const target = new Date(date).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
  };
}

/**
 * RSVP status label
 */
export const rsvpStatusLabels: Record<RSVPStatus, Record<Language, string>> = {
  confirmed: { ru: "Подтвердил", kz: "Растады" },
  declined: { ru: "Отказал", kz: "Бас тартты" },
  maybe: { ru: "Под вопросом", kz: "Ойланып жатыр" },
  pending: { ru: "Не ответил", kz: "Жауап бермеді" },
};

/**
 * RSVP status color config
 */
export const rsvpStatusConfig: Record<RSVPStatus, { bg: string; color: string }> = {
  confirmed: { bg: "var(--success-bg)", color: "var(--success)" },
  declined: { bg: "var(--danger-bg)", color: "var(--danger)" },
  maybe: { bg: "var(--warning-bg)", color: "var(--warning)" },
  pending: { bg: "var(--info-bg)", color: "var(--info)" },
};

/**
 * Guest side labels
 */
export const guestSideLabels: Record<GuestSide, Record<Language, string>> = {
  groom: { ru: "Жених", kz: "Күйеу жігіт" },
  bride: { ru: "Невеста", kz: "Қалыңдық" },
  common: { ru: "Общие", kz: "Ортақ" },
};

/**
 * Event type labels
 */
export const eventTypeLabels: Record<EventType, Record<Language, string>> = {
  wedding: { ru: "Свадьба / Той", kz: "Той" },
  qyz_uzatu: { ru: "Қыз ұзату", kz: "Қыз ұзату" },
  betashar: { ru: "Беташар", kz: "Беташар" },
  qudalyq: { ru: "Құдалық", kz: "Құдалық" },
  anniversary: { ru: "Юбилей", kz: "Мерейтой" },
  sundet_toi: { ru: "Сүндет той", kz: "Сүндет той" },
  birthday: { ru: "День рождения", kz: "Туған күн" },
  tusau_kesu: { ru: "Тұсау кесу", kz: "Тұсау кесу" },
  other: { ru: "Другое", kz: "Басқа" },
};

/**
 * Event type emojis
 */
export const eventTypeEmojis: Record<EventType, string> = {
  wedding: "💍",
  qyz_uzatu: "👰",
  betashar: "🎭",
  qudalyq: "🤝",
  anniversary: "🎂",
  sundet_toi: "👶",
  birthday: "🎈",
  tusau_kesu: "👣",
  other: "✨",
};

/**
 * Generate a short readable ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Pluralize Russian nouns
 */
export function pluralize(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}