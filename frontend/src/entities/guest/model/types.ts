export type RsvpStatus = 'confirmed' | 'declined' | 'maybe' | 'pending'

export type GuestSide = 'groom' | 'bride' | 'common'

export type GuestCategory = 'family' | 'relatives' | 'friends' | 'colleagues' | 'other'

export type Guest = {
  id: string
  eventId: string
  name: string
  personalGreeting?: string
  count: number
  side: GuestSide
  category: GuestCategory
  status: RsvpStatus
  phone?: string
  token: string
  isVip: boolean
  isElder: boolean
  hasChildren: boolean
  assignedStageIds: string[]
  comment?: string
  respondedAt?: string
  openedAt?: string
}

export type GuestFilters = {
  status?: RsvpStatus
  search?: string
}

export const guestSideLabels: Record<GuestSide, { ru: string; kk: string }> = {
  bride: { ru: 'Невеста', kk: 'Қалыңдық' },
  groom: { ru: 'Жених', kk: 'Күйеу жігіт' },
  common: { ru: 'Общие', kk: 'Ортақ' },
}

export const rsvpStatusLabels: Record<RsvpStatus, { ru: string; kk: string }> = {
  confirmed: { ru: 'Подтвердили', kk: 'Растады' },
  declined: { ru: 'Отказались', kk: 'Бас тартты' },
  maybe: { ru: 'Под вопросом', kk: 'Ойланып жатыр' },
  pending: { ru: 'Не ответили', kk: 'Жауап бермеді' },
}
