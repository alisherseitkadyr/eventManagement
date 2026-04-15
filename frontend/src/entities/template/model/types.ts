export type Template = {
  id: string
  name: string
  category: string
  previewImage?: string
}

export type TemplateSchema = {
  blocks: {
    type: string
    key: string
    value: string
  }[]
}



export interface TemplateFull extends Template {
  content?: {
    backgroundImage?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    address?: string;
    gallery?: string[];
    buttonText?: string;
    footer?: string;
  };
  // Keep schema for backward compatibility if needed
  schema?: Record<string, unknown>;
}
