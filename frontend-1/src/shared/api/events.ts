import type { CreateEventInput } from '@entities/event'
import {
  createEvent as createMockEvent,
  getEventById,
  getEventStatsById,
  listEvents,
} from '@shared/api/mock-db'

export async function createEvent(payload: CreateEventInput) {
  return createMockEvent(payload)
}

export async function getEvent(eventId: string) {
  return getEventById(eventId)
}

export async function getEventStats(eventId: string) {
  return getEventStatsById(eventId)
}

export async function getEvents() {
  return listEvents()
}
