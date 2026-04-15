import type { Template, TemplateFull } from "../../entities/template/model/types"

export const templatesMock: TemplateFull[] = [
  {
    id: "tpl_001",
    name: "Bridal Shower Classic",
    category: "wedding",
    previewImage: "/templates/tpl_001.png",
    schema: {
      blocks: [
        { type: "text", key: "title", value: "Bridal Shower" },
        { type: "text", key: "subtitle", value: "You're invited!" },
        { type: "text", key: "date", value: "June 30, 11 AM" },
        { type: "text", key: "location", value: "Victorian Tea Room" }
      ]
    }
  },
  {
    id: "tpl_002",
    name: "Floral Birthday",
    category: "birthday",
    previewImage: "/templates/tpl_002.png",
    schema: {
      blocks: [
        { type: "text", key: "title", value: "Birthday Party" },
        { type: "text", key: "subtitle", value: "Join us to celebrate!" },
        { type: "text", key: "date", value: "April 14" }
      ]
    }
  },
  {
    id: "tpl_003",
    name: "Kids Party Fun",
    category: "party",
    previewImage: "/templates/tpl_003.png",
    schema: {
      blocks: [
        { type: "text", key: "title", value: "Kids Party 🎉" },
        { type: "text", key: "subtitle", value: "Games & Fun!" }
      ]
    }
  }
]