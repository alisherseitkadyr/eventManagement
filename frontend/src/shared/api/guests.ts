import type { GuestFilters } from '@entities/guest'
import { listGuestsByEvent } from '@shared/api/mock-db'

export async function getEventGuests(eventId: string, filters?: GuestFilters) {
  return listGuestsByEvent(eventId, filters)
}
