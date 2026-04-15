import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '@shared/constants/i18n'
import { Select } from '@shared/ui'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/70 px-3 py-2 text-sm text-[var(--color-muted)]">
      <span>{t('common.language')}</span>
      <Select
        className="min-w-20 border-none bg-transparent px-2 py-1 pr-8 text-sm shadow-none focus:ring-0"
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
        value={i18n.language}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {language.toUpperCase()}
          </option>
        ))}
      </Select>
    </label>
  )
}
