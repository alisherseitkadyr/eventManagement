import type { RSVPStatus, GuestSide } from "@/shared/types/common";

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  personalGreeting?: string;
  count: number;
  side: GuestSide;
  category: GuestCategory;
  status: RSVPStatus;
  phone?: string;
  email?: string;
  token: string; // unique invitation link token
  isVip: boolean;
  isElder: boolean;
  hasChildren: boolean;
  assignedStageIds: string[]; // which stages this guest sees
  comment?: string;
  respondedAt?: string;
  openedAt?: string;
  familyGroupId?: string;
}

export type GuestCategory = "family" | "relatives" | "friends" | "colleagues" | "other";

export const guestCategoryLabels: Record<GuestCategory, { ru: string; kz: string }> = {
  family: { ru: "Семья", kz: "Отбасы" },
  relatives: { ru: "Родственники", kz: "Туысқандар" },
  friends: { ru: "Друзья", kz: "Достар" },
  colleagues: { ru: "Коллеги", kz: "Әріптестер" },
  other: { ru: "Другое", kz: "Басқа" },
};

export interface GuestFilters {
  status?: RSVPStatus;
  side?: GuestSide;
  category?: GuestCategory;
  search?: string;
}

export interface AddGuestInput {
  name: string;
  count: number;
  side: GuestSide;
  category: GuestCategory;
  phone?: string;
  isVip?: boolean;
  isElder?: boolean;
  assignedStageIds?: string[];
}

export interface BulkGuestImport {
  guests: AddGuestInput[];
}