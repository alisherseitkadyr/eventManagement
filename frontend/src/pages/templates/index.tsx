import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchTemplates } from '@shared/api/templates'
import type { Template } from '@entities/template/model/types'
import { TemplateGrid } from '../../features/templates/ui/templatesGrid'
import { SearchBar } from '../../features/templates/ui/searchBar'
import { CategoryTabs } from '../../features/templates/ui/categoryTab'
import { routeBuilders } from '@app/routes/route-paths'
import { legacyBackground } from '@shared/lib/legacy-theme'

const categories = ['all', 'wedding', 'birthday', 'party']

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<Template[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const handleTemplateClick = (templateId: string) => {
    navigate(routeBuilders.templatePreview(templateId))
  }

  useEffect(() => {
    fetchTemplates(category === 'all' ? '' : category, search).then(setTemplates)
  }, [category, search])

  return (
    <div
      className="min-h-screen"
      style={{ background: legacyBackground, fontFamily: 'var(--font-body)' }}
    >
      <main className="p-5 md:p-8">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryTabs categories={categories} active={category} onChange={setCategory} />
        <TemplateGrid templates={templates} onClick={handleTemplateClick} />
      </main>
    </div>
  )
}
