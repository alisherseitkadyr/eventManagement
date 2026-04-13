import type { PropsWithChildren } from 'react'
import { QueryProvider } from '@app/providers/query/query-provider'
import { I18nProvider } from '@app/providers/i18n/i18n-provider'
import { AuthProvider } from '@app/providers/auth/auth-provider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <I18nProvider>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </I18nProvider>
  )
}
