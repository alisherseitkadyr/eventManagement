import type { EventProject, EventStats, CreateEventInput } from "./types";
import { api, useBackendApi } from "@/shared/lib/api";

// ═══════════════════════════════════════════
// Mock Data (replace with real API calls)
// ═══════════════════════════════════════════
export const MOCK_EVENT: EventProject = {
  id: "evt_001",
  type: "wedding",
  templateStyle: "elegant",
  languages: ["ru", "kz"],
  accentColor: "#7A2E3A",
  title: { ru: "Свадьба Айданы & Нурлана", kz: "Айдана мен Нұрланның тойы" },
  subtitle: { ru: "Приглашение", kz: "Шақыру" },
  description: {
    ru: "Мы рады пригласить вас на самый важный день в нашей жизни. Будем счастливы разделить этот праздник вместе с вами.",
    kz: "Біз сізді өміріміздегі ең маңызды күнге шақыруға қуаныштымыз. Бұл мерекені сіздермен бірге бөлісуге қуаныштымыз.",
  },
  stages: [
    {
      id: "stg_1",
      name: { ru: "Қыз ұзату", kz: "Қыз ұзату" },
      date: "2026-07-14",
      time: "12:00",
      place: 'Ресторан "Алтын Ғасыр"',
      address: "ул. Абая 52, Алматы",
      emoji: "👰",
    },
    {
      id: "stg_2",
      name: { ru: "Неке қию", kz: "Неке қию" },
      date: "2026-07-15",
      time: "15:00",
      place: "Мечеть Хазрет Султан",
      address: "пр. Тәуелсіздік 48, Астана",
      emoji: "🕌",
    },
    {
      id: "stg_3",
      name: { ru: "Основной той", kz: "Негізгі той" },
      date: "2026-07-15",
      time: "18:00",
      place: 'Банкетный зал "Достар"',
      address: "пр. Кабанбай батыра 11, Астана",
      emoji: "🎉",
    },
  ],
  dressCode: { ru: "Пастельные тона, без белого", kz: "Пастель түстер, ақсыз" },
  giftWishes: { ru: "Ваше присутствие — лучший подарок", kz: "Сіздің қатысуыңыз — ең жақсы сыйлық" },
  coordinatorName: "Айгерим Касымова",
  coordinatorPhone: "+7 701 123 45 67",
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-04-08T14:30:00Z",
  published: true,
};

export const MOCK_STATS: EventStats = {
  totalGuests: 10,
  totalPeople: 23,
  confirmed: 5,
  confirmedPeople: 14,
  declined: 1,
  maybe: 1,
  pending: 3,
};

// ═══════════════════════════════════════════
// API Functions
// ═══════════════════════════════════════════
export const eventsApi = {
  listAll: async (): Promise<EventProject[]> => {
    if (useBackendApi) {
      return api.get<EventProject[]>("/events");
    }
    return [MOCK_EVENT];
  },

  getById: async (id: string): Promise<EventProject> => {
    if (useBackendApi) {
      return api.get<EventProject>(`/events/${id}`);
    }

    return { ...MOCK_EVENT, id };
  },

  getStats: async (id: string): Promise<EventStats> => {
    if (useBackendApi) {
      return api.get<EventStats>(`/events/${id}/stats`);
    }

    return MOCK_STATS;
  },

  create: async (input: CreateEventInput): Promise<EventProject> => {
    return api.post<EventProject>("/events", input);
  },

  update: async (id: string, data: Partial<EventProject>): Promise<EventProject> => {
    if (!useBackendApi) {
      return { ...MOCK_EVENT, ...data, id, updatedAt: new Date().toISOString() };
    }

    return api.patch<EventProject>(`/events/${id}`, data);
  },

  publish: async (id: string): Promise<void> => {
    if (!useBackendApi) {
      return;
    }

    return api.post(`/events/${id}/publish`);
  },

  unpublish: async (id: string): Promise<void> => {
    if (!useBackendApi) {
      return;
    }

    return api.post(`/events/${id}/unpublish`);
  },
};
