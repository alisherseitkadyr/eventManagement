import { getInvitationByToken, markInvitationOpened } from '@shared/api/mock-db'

export async function getInvitation(token: string) {
  return getInvitationByToken(token)
}

export async function openInvitation(token: string) {
  return markInvitationOpened(token)
}
