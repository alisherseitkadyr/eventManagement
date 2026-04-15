import type { RsvpSubmitInput } from '@entities/invitation'
import { submitRsvp } from '@shared/api/mock-db'

export async function submitInvitationRsvp(payload: RsvpSubmitInput) {
  return submitRsvp(payload)
}
