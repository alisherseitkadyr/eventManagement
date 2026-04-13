import type { Event, EventStage } from '@entities/event/model/types'
import type { Guest, RsvpStatus } from '@entities/guest/model/types'

export type RsvpResponse = {
  guestId: string
  status: RsvpStatus
  count: number
  needsTransfer: boolean
  hasChildren: boolean
  dietaryRestrictions?: string
  comment?: string
}

export type InvitationPayload = {
  event: Event
  guest: Guest
  visibleStages: EventStage[]
  response: RsvpResponse | null
  invitationUrl: string
}

export type RsvpSubmitInput = {
  token: string
  status: RsvpStatus
  count?: number
  comment?: string
  needsTransfer?: boolean
  hasChildren?: boolean
  dietaryRestrictions?: string
}
