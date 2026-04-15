import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchTemplateById } from "../../shared/api/templates"
import type { TemplateFull } from "../../entities/template/model/types"

export const TemplatePreviewPage: React.FC = () => {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const [template, setTemplate] = useState<TemplateFull | null>(null)

  useEffect(() => {
    if (templateId) fetchTemplateById(templateId).then(setTemplate)
  }, [templateId])  

  if (!template) return templateId ? <p>Loading...</p> : <p>Template not found</p>

  return (
    <div className="flex gap-12 p-8">

  {/* LEFT */}    
  <div className="flex-1 max-w-3xl mx-auto">
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <img
        src={template.previewImage}
        className="w-full"
      />
    </div>
  </div>

  {/* RIGHT */}
  <div className="w-full md:w-auto md:flex-1 space-y-4">
      <h1 className="text-2xl font-semibold">{template.name}</h1>
      <p className="text-gray-500">{template.category}</p>
      <button
        onClick={() => navigate(`/editor/${template.id}`)}
        className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
      >
        Customize
      </button>
    </div>

</div>
  )
}