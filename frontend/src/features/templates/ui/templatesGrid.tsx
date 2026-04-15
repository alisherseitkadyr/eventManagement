import type { Template } from "../../../entities/template/model/types"
import { TemplateCard } from "../../../widgets/template-card/template-card"

type Props = {
  templates: Template[]
  onClick: (id: string) => void
}

export const TemplateGrid = ({ templates, onClick }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
      {templates.map((t) => (
        <TemplateCard key={t.id} template={t} onClick={onClick} />
      ))}
    </div>
  )
}
