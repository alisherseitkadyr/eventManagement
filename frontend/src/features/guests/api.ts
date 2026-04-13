import type { Guest, GuestFilters, AddGuestInput } from "./types";

// ═══════════════════════════════════════════
// Mock Data
// ═══════════════════════════════════════════
export const MOCK_GUESTS: Guest[] = [
  { id: "g1", eventId: "evt_001", name: "Семья Нургалиевых", count: 4, side: "bride", category: "family", status: "confirmed", phone: "+7 701 123 4567", token: "nurgali", isVip: true, isElder: false, hasChildren: true, assignedStageIds: ["stg_1", "stg_2", "stg_3"], respondedAt: "2026-04-01T10:00:00Z", openedAt: "2026-03-28T09:00:00Z" },
  { id: "g2", eventId: "evt_001", name: "Ержан Касымов", count: 1, side: "groom", category: "friends", status: "confirmed", phone: "+7 702 234 5678", token: "erzhan", isVip: false, isElder: false, hasChildren: false, assignedStageIds: ["stg_3"], respondedAt: "2026-04-02T15:00:00Z", openedAt: "2026-04-01T12:00:00Z" },
  { id: "g3", eventId: "evt_001", name: "Семья Байтурсыновых", count: 3, side: "bride", category: "relatives", status: "pending", phone: "+7 707 345 6789", token: "baitur", isVip: false, isElder: true, hasChildren: false, assignedStageIds: ["stg_1", "stg_2", "stg_3"] },
  { id: "g4", eventId: "evt_001", name: "Дана и Арман Сагиновы", count: 2, side: "common", category: "friends", status: "declined", phone: "+7 700 456 7890", token: "sagino", isVip: false, isElder: false, hasChildren: false, assignedStageIds: ["stg_3"], respondedAt: "2026-04-03T10:00:00Z", openedAt: "2026-04-02T09:00:00Z", comment: "К сожалению, будем в отпуске" },
  { id: "g5", eventId: "evt_001", name: "Бауыржан Омаров", count: 1, side: "groom", category: "colleagues", status: "maybe", phone: "+7 705 567 8901", token: "bauyrzh", isVip: false, isElder: false, hasChildren: false, assignedStageIds: ["stg_3"], respondedAt: "2026-04-05T16:00:00Z", openedAt: "2026-04-04T11:00:00Z" },
  { id: "g6", eventId: "evt_001", name: "Семья Алдабергеновых", count: 5, side: "bride", category: "relatives", status: "confirmed", phone: "+7 708 678 9012", token: "aldabe", isVip: true, isElder: true, hasChildren: true, assignedStageIds: ["stg_1", "stg_2", "stg_3"], respondedAt: "2026-03-30T08:00:00Z", openedAt: "2026-03-29T07:00:00Z" },
  { id: "g7", eventId: "evt_001", name: "Мадина Ахметова", count: 1, side: "common", category: "friends", status: "pending", phone: "+7 701 789 0123", token: "madina", isVip: false, isElder: false, hasChildren: false, assignedStageIds: ["stg_3"] },
  { id: "g8", eventId: "evt_001", name: "Семья Токтаровых", count: 3, side: "groom", category: "family", status: "confirmed", phone: "+7 776 890 1234", token: "toktar", isVip: true, isElder: false, hasChildren: true, assignedStageIds: ["stg_2", "stg_3"], respondedAt: "2026-04-06T12:00:00Z", openedAt: "2026-04-05T10:00:00Z" },
  { id: "g9", eventId: "evt_001", name: "Асель Жумабаева", count: 2, side: "bride", category: "friends", status: "pending", phone: "+7 747 901 2345", token: "aselzh", isVip: false, isElder: false, hasChildren: false, assignedStageIds: ["stg_1", "stg_3"] },
  { id: "g10", eventId: "evt_001", name: "Тимур Сейтказин", count: 1, side: "groom", category: "colleagues", status: "confirmed", phone: "+7 702 012 3456", token: "timurs", isVip: false, isElder: false, hasChildren: false, assignedStageIds: ["stg_3"], respondedAt: "2026-04-07T09:00:00Z", openedAt: "2026-04-06T08:00:00Z" },
];

// ═══════════════════════════════════════════
// API Functions
// ═══════════════════════════════════════════
export const guestsApi = {
  getByEvent: async (eventId: string, filters?: GuestFilters): Promise<Guest[]> => {
    let guests = MOCK_GUESTS.filter((g) => g.eventId === eventId);
    if (filters?.status) guests = guests.filter((g) => g.status === filters.status);
    if (filters?.side) guests = guests.filter((g) => g.side === filters.side);
    if (filters?.category) guests = guests.filter((g) => g.category === filters.category);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      guests = guests.filter((g) => g.name.toLowerCase().includes(q));
    }
    return guests;
  },

  getByToken: async (token: string): Promise<Guest> => {
    const guest = MOCK_GUESTS.find((g) => g.token === token);
    if (!guest) throw new Error("Guest not found");
    return guest;
  },

  add: async (eventId: string, input: AddGuestInput): Promise<Guest> => {
    return {
      id: `gst_${Date.now()}`,
      eventId,
      name: input.name,
      count: input.count,
      side: input.side,
      category: input.category,
      status: "pending",
      phone: input.phone,
      token: `invite_${Date.now()}`,
      isVip: input.isVip ?? false,
      isElder: input.isElder ?? false,
      hasChildren: false,
      assignedStageIds: input.assignedStageIds ?? [],
    };
  },

  update: async (guestId: string, data: Partial<Guest>): Promise<Guest> => {
    const guest = MOCK_GUESTS.find((item) => item.id === guestId);
    if (!guest) {
      throw new Error("Guest not found");
    }

    return { ...guest, ...data };
  },

  delete: async (guestId: string): Promise<void> => {
    void guestId;
  },

  sendReminder: async (guestId: string): Promise<void> => {
    void guestId;
  },

  exportCsv: async (eventId: string): Promise<Blob> => {
    void eventId;
    // Would return blob from API
    return new Blob([""], { type: "text/csv" });
  },
};
