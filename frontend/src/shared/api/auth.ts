import { apiClient } from '@shared/api/client'

export type SignInPayload = {
  email: string
  password: string
}

export type SignUpPayload = {
  name: string
  email: string
  password: string
}

export type UserSession = {
  id: string
  name: string
  email: string
}

export async function signIn(payload: SignInPayload) {
  return apiClient.post('/auth/sign-in', payload)
}

export async function signUp(payload: SignUpPayload) {
  return apiClient.post('/auth/sign-up', payload)
}

export async function getSession() {
  return apiClient.get<UserSession>('/auth/session')
}
