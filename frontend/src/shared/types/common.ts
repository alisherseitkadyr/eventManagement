// ═══════════════════════════════════════════
// Common Types
// ═══════════════════════════════════════════

export type Language = "ru" | "kz";

export type RSVPStatus = "confirmed" | "declined" | "maybe" | "pending";

export type GuestSide = "groom" | "bride" | "common";

export type EventType =
  | "wedding"
  | "qyz_uzatu"
  | "betashar"
  | "qudalyq"
  | "anniversary"
  | "sundet_toi"
  | "birthday"
  | "tusau_kesu"
  | "other";

export type TemplateStyle = "modern" | "elegant" | "national";

export interface LocalizedText {
  ru: string;
  kz: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}