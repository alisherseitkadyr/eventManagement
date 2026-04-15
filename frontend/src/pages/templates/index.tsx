import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchTemplates } from "../../shared/api/templates"
import type { Template } from "../../entities/template/model/types"
import { TemplateGrid } from "../../features/templates/ui/templatesGrid"
import { SearchBar } from "../../features/templates/ui/searchBar"
import { CategoryTabs } from "../../features/templates/ui/categoryTab"
import { Sidebar } from "../../widgets/sidebar"
import { routeBuilders } from "../../app/routes/route-paths"
import { legacyBackground, legacyThemeVars } from "../../shared/lib/legacy-theme"

const categories = ["all", "wedding", "birthday", "party"]
export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<Template[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleTemplateClick = (templateId: string) => {
    navigate(routeBuilders.templatePreview(templateId))
  }

  useEffect(() => {
    fetchTemplates(category === "all" ? "" : category, search).then(setTemplates)
  }, [category, search])

  return (
    <div
      className="min-h-screen bg-[var(--cream)]"
      style={{
        ...legacyThemeVars,
        fontFamily: 'var(--font-body)',
        background: legacyBackground,
      }}
    >
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {/* ... mobile header ... */}
      <div className="min-h-screen md:ml-[260px]">
        <main className="p-5 md:p-8">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryTabs
            categories={categories}
            active={category}
            onChange={setCategory}
          />
          <TemplateGrid
            templates={templates}
            onClick={handleTemplateClick}
          />
        </main>
      </div>
    </div>
  )
}
