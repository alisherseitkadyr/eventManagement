export type Template = {
  id: string
  name: string
  category: string
  previewImage: string
}

export type TemplateSchema = {
  blocks: {
    type: string
    key: string
    value: string
  }[]
}

export type TemplateFull = Template & {
  schema: TemplateSchema
}