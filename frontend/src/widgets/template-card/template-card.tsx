import type { Template } from "../../entities/template/model/types"

type Props = {
  template: Template
  onClick: (id: string) => void
}
export const TemplateCard = ({ template, onClick }: Props) => {
  return (
    <div
      onClick={() => onClick(template.id)}
      className="cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 bg-white"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={template.previewImage}
          alt={template.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800">
          {template.name}
        </h3>

      </div>
    </div>
  )
}
