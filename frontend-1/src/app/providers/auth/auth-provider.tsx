import type { PropsWithChildren } from 'react'
import { createContext, useEffect, useMemo, useState } from 'react'
import type { SignInPayload, SignUpPayload, UserSession } from '@shared/api/auth'

type AuthContextValue = {
  isAuthenticated: boolean
  isReady: boolean
  session: UserSession | null
  signIn: (payload: SignInPayload) => Promise<void>
  signUp: (payload: SignUpPayload) => Promise<void>
  signOut: () => void
}

const AUTH_STORAGE_KEY = 'qonaq-session'

export const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredSession(): UserSession | null {
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
  const [session, setSession] = useState<UserSession | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setSession(readStoredSession())
    setIsReady(true)
  }, [])

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
