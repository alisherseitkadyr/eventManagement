import type { PropsWithChildren } from 'react'
import { useMemo, useState } from 'react'
import type { UserSession } from '@shared/api/auth'
import { AuthContext, type AuthContextValue } from '@app/providers/auth/auth-context'

const AUTH_STORAGE_KEY = 'qonaq-session'

function readStoredSession(): UserSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession) as UserSession
  } catch {
    return null
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<UserSession | null>(() => readStoredSession())
  const isReady = true

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session),
      isReady,
      session,
      async signIn(payload) {
        const nextSession: UserSession = {
          id: 'demo-user',
          name: payload.email.split('@')[0] || 'Qonaq User',
          email: payload.email,
        }

        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession))
        setSession(nextSession)
      },
      async signUp(payload) {
        const nextSession: UserSession = {
          id: 'demo-user',
          name: payload.name,
          email: payload.email,
        }

        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession))
        setSession(nextSession)
      },
      signOut() {
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
        setSession(null)
      },
    }),
    [isReady, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
