import type { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { i18n } from '@app/providers/i18n/config'

export function I18nProvider({ children }: PropsWithChildren) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
