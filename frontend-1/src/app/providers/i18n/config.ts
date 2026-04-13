import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type Language } from '@shared/constants/i18n'
import { kk } from '@shared/config/locales/kk'
import { ru } from '@shared/config/locales/ru'

const resources = {
  ru: { translation: ru },
  kk: { translation: kk },
} as const

function getInitialLanguage(): Language {
  const storedLanguage = window.localStorage.getItem('qonaq-language')

  if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage as Language)) {
    return storedLanguage as Language
  }

  const browserLanguage = window.navigator.language.slice(0, 2) as Language

  if (SUPPORTED_LANGUAGES.includes(browserLanguage)) {
    return browserLanguage
  }

  return DEFAULT_LANGUAGE
}

void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (language) => {
  window.localStorage.setItem('qonaq-language', language)
  document.documentElement.lang = language
})

document.documentElement.lang = i18n.language

export { i18n }
