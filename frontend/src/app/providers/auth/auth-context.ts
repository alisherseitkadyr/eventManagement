import { createContext } from 'react'
import type { SignInPayload, SignUpPayload, UserSession } from '@shared/api/auth'

export type AuthContextValue = {
  isAuthenticated: boolean
  isReady: boolean
  session: UserSession | null
  signIn: (payload: SignInPayload) => Promise<void>
  signUp: (payload: SignUpPayload) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
