export interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  templateStyle: string;
  accentColor: string;
  languages: string[];
  previewImageUrl: string;
  blocks: TemplateBlock[];
}

export interface TemplateBlock {
  blockId: string;
  label: string;
  icon: string;
  enabled: boolean;
  settings?: Record<string, unknown>;
}
