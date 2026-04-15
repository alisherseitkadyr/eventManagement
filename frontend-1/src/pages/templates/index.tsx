import React, { useEffect, useState } from "react"
import { fetchTemplates } from "../../shared/api/templates"
import type { Template } from "../../entities/template/model/types"
import { TemplateGrid } from "../../features/templates/ui/templatesGrid"
import { SearchBar } from "../../features/templates/ui/searchBar"
import { CategoryTabs } from "../../features/templates/ui/categoryTab"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "../../widgets/sidebar"

const categories = ["all", "wedding", "birthday", "party"]

export const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [mobileOpen, setMobileOpen] = useState(false)


  const navigate = useNavigate()

  useEffect(() => {
    fetchTemplates(category === "all" ? "" : category, search).then(setTemplates)
  }, [category, search])

  return (
        <div className="min-h-screen bg-[var(--cream)]" style={{ fontFamily: 'var(--font-body)' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-35 bg-black/30 backdrop-blur-sm"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
    <div className="min-h-screen md:ml-[260px]">
        {/* Mobile header with menu button (similar to DashboardLayout) */}
        <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-lg bg-white/80 border-b border-[var(--sand)] md:hidden">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--sand)] bg-white/90 text-[var(--burgundy)]"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
          </button>
          <div>
            <div className="text-sm font-semibold text-[var(--charcoal)]">Templates</div>
            <div className="text-xs text-[var(--warm-gray)]">Choose a design</div>
          </div>
        </div>

        <main className="p-5 md:p-8">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryTabs
            categories={categories}
            active={category}
            onChange={setCategory}
          />
          <TemplateGrid
            templates={templates}
            onClick={(id) => navigate(`/templates/${id}`)}
          />
        </main>
      </div>
    </div>

  )
}