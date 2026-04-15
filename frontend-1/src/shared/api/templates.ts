import { templatesMock } from "./mock-template"
import type { Template, TemplateFull } from "../../entities/template/model/types"

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

export async function fetchTemplates(
  category?: string,
  search?: string
): Promise<Template[]> {
  await delay(300)

  let data = [...templatesMock]

  if (category && category !== "all") {
    data = data.filter((t) => t.category === category)
  }

  if (search) {
    data = data.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  return data.map(({ schema, ...rest }) => rest)
}

export async function fetchTemplateById(
  id: string
): Promise<TemplateFull | null> {
  await delay(300)

  return templatesMock.find((t) => t.id === id) || null
}