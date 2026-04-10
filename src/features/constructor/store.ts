import type { Language, TemplateStyle } from "@/shared/types/common";

export interface ConstructorBlock {
  id:
    | "cover"
    | "names"
    | "countdown"
    | "story"
    | "program"
    | "map"
    | "dresscode"
    | "gallery"
    | "rsvp"
    | "contacts";
  label: string;
  icon: string;
  enabled: boolean;
}

export const defaultConstructorBlocks: ConstructorBlock[] = [
  { id: "cover", label: "Обложка", icon: "🖼", enabled: true },
  { id: "names", label: "Имена", icon: "💑", enabled: true },
  { id: "countdown", label: "Обратный отсчет", icon: "⏳", enabled: true },
  { id: "story", label: "Обращение", icon: "💌", enabled: true },
  { id: "program", label: "Программа", icon: "📋", enabled: true },
  { id: "map", label: "Карта", icon: "📍", enabled: true },
  { id: "dresscode", label: "Дресс-код", icon: "👗", enabled: false },
  { id: "gallery", label: "Галерея", icon: "📸", enabled: false },
  { id: "rsvp", label: "RSVP", icon: "✅", enabled: true },
  { id: "contacts", label: "Контакты", icon: "📞", enabled: true },
];

export const templateStyles: Array<{ value: TemplateStyle; label: string }> = [
  { value: "modern", label: "Modern" },
  { value: "elegant", label: "Elegant" },
  { value: "national", label: "National" },
];

export const constructorLanguages: Array<{ value: "both" | Language; label: string }> = [
  { value: "ru", label: "Русский" },
  { value: "kz", label: "Қазақша" },
  { value: "both", label: "Оба" },
];

export const accentPalette = [
  "#7A2E3A",
  "#C9A96E",
  "#B8674D",
  "#2C2825",
  "#3B6B5F",
  "#5B4A8A",
];
