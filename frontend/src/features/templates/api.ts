import { api, useBackendApi } from "@/shared/lib/api";
import type { Template } from "./types";

const MOCK_TEMPLATES: Template[] = [
  { id: "tpl_001", name: "Elegant Wedding",      description: "", type: "wedding",   templateStyle: "elegant",     accentColor: "#7A2E3A", languages: ["ru", "kz"], previewImageUrl: "", blocks: [] },
  { id: "tpl_002", name: "Modern Minimal",       description: "", type: "universal", templateStyle: "minimal",     accentColor: "#111111", languages: ["ru", "kz"], previewImageUrl: "", blocks: [] },
  { id: "tpl_003", name: "Kazakh Traditional",   description: "", type: "wedding",   templateStyle: "traditional", accentColor: "#C9A227", languages: ["kz", "ru"], previewImageUrl: "", blocks: [] },
  { id: "tpl_004", name: "Birthday Fun",         description: "", type: "birthday",  templateStyle: "colorful",    accentColor: "#FF6B6B", languages: ["ru"],        previewImageUrl: "", blocks: [] },
  { id: "tpl_005", name: "Corporate Clean",      description: "", type: "corporate", templateStyle: "clean",       accentColor: "#2563EB", languages: ["ru", "en"], previewImageUrl: "", blocks: [] },
];

export const templatesApi = {
  listAll: async (): Promise<Template[]> => {
    if (useBackendApi) {
      return api.get<Template[]>("/templates");
    }
    return MOCK_TEMPLATES;
  },

  getById: async (id: string): Promise<Template> => {
    if (useBackendApi) {
      return api.get<Template>(`/templates/${id}`);
    }
    const found = MOCK_TEMPLATES.find((t) => t.id === id);
    if (!found) throw new Error("Template not found");
    return found;
  },
};
 