import type { EventType, TemplateStyle, Language, LocalizedText } from "@/shared/types/common";

export interface EventStage {
  id: string;
  name: LocalizedText;
  date: string;
  time: string;
  place: string;
  address: string;
  mapUrl?: string;
  description?: LocalizedText;
  emoji?: string;
}

export interface EventProject {
  id: string;
  type: EventType;
  templateStyle: TemplateStyle;
  languages: Language[];
  accentColor: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  description?: LocalizedText;
  stages: EventStage[];
  coverImageUrl?: string;
  dressCode?: LocalizedText;
  giftWishes?: LocalizedText;
  coordinatorName: string;
  coordinatorPhone: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface EventStats {
  totalGuests: number;
  totalPeople: number;
  confirmed: number;
  confirmedPeople: number;
  declined: number;
  maybe: number;
  pending: number;
}

export interface CreateEventInput {
  type: EventType;
  title: LocalizedText;
  templateStyle: TemplateStyle;
  languages: Language[];
}