import type {
  Event,
  EventLanguage,
  EventStage,
  EventStats,
  LocalizedText,
} from '@entities/event'
import type { Guest, RsvpStatus } from '@entities/guest'

export function getLocalizedText(value: LocalizedText | undefined, language: EventLanguage) {
  return value?.[language] ?? value?.ru ?? value?.kk ?? ''
}

export function formatEventDate(date: string, language: EventLanguage) {
  return new Intl.DateTimeFormat(language === 'kk' ? 'kk-KZ' : 'ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function getCountdown(date: string) {
  const diff = Math.max(0, new Date(date).getTime() - Date.now())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)

  return { days, hours, minutes }
}

export function getVisibleStages(event: Event, guest?: Guest) {
  if (!guest || guest.assignedStageIds.length === 0) {
    return event.stages
  }

  return event.stages.filter((stage) => guest.assignedStageIds.includes(stage.id))
}

export function buildInvitationPath(token: string) {
  return `/invite/${token}`
}

export function buildInvitationUrl(token: string) {
  if (typeof window === 'undefined') {
    return buildInvitationPath(token)
  }

  return `${window.location.origin}${buildInvitationPath(token)}`
}

export function getEventStats(guests: Guest[]): EventStats {
  return {
    totalGuests: guests.length,
    totalPeople: guests.reduce((sum, guest) => sum + guest.count, 0),
    confirmed: guests.filter((guest) => guest.status === 'confirmed').length,
    confirmedPeople: guests
      .filter((guest) => guest.status === 'confirmed')
      .reduce((sum, guest) => sum + guest.count, 0),
    declined: guests.filter((guest) => guest.status === 'declined').length,
    maybe: guests.filter((guest) => guest.status === 'maybe').length,
    pending: guests.filter((guest) => guest.status === 'pending').length,
  }
}

export function pluralizeGuests(count: number, language: EventLanguage) {
  return language === 'kk'
    ? `${count} qonaq`
    : `${count} ${count === 1 ? 'gost' : 'gostei'}`
}

export const rsvpTone: Record<RsvpStatus, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  declined: 'bg-rose-100 text-rose-700',
  maybe: 'bg-amber-100 text-amber-700',
  pending: 'bg-slate-100 text-slate-600',
}

export const stageGradients = [
  'from-rose-500 to-pink-600',
  'from-amber-400 to-orange-500',
  'from-fuchsia-500 to-rose-500',
]
