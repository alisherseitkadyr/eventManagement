import type { CreateEventInput, Event } from '@entities/event'
import type { Guest, GuestFilters } from '@entities/guest'
import type { InvitationPayload, RsvpResponse, RsvpSubmitInput } from '@entities/invitation'
import { buildInvitationPath, getEventStats, getVisibleStages } from '@shared/lib/event-utils'

type MockDatabase = {
  events: Event[]
  guests: Guest[]
  responses: Record<string, RsvpResponse>
}

const STORAGE_KEY = 'qonaq-migration-db'

const seedEvent: Event = {
  id: 'evt_001',
  type: 'wedding',
  templateStyle: 'elegant',
  languages: ['ru', 'kk'],
  accentColor: '#7A2E3A',
  title: {
    ru: 'Свадьба Айданы & Нурлана',
    kk: 'Айдана мен Нұрланның тойы',
  },
  subtitle: {
    ru: 'Приглашение',
    kk: 'Шақыру',
  },
  description: {
    ru: 'Мы рады пригласить вас на самый важный день в нашей жизни. Будем счастливы разделить этот праздник вместе с вами.',
    kk: 'Біз сіздерді өміріміздегі ең маңызды күнге шақыруға қуаныштымыз. Бұл мерекені сіздермен бірге бөлісуге қуаныштымыз.',
  },
  stages: [
    {
      id: 'stg_1',
      name: { ru: 'Қыз ұзату', kk: 'Қыз ұзату' },
      date: '2026-07-14',
      time: '12:00',
      place: 'Ресторан "Алтын Ғасыр"',
      address: 'ул. Абая 52, Алматы',
      emoji: '👰',
    },
    {
      id: 'stg_2',
      name: { ru: 'Неке қию', kk: 'Неке қию' },
      date: '2026-07-15',
      time: '15:00',
      place: 'Мечеть Хазрет Султан',
      address: 'пр. Тәуелсіздік 48, Астана',
      emoji: '🕌',
    },
    {
      id: 'stg_3',
      name: { ru: 'Основной той', kk: 'Негізгі той' },
      date: '2026-07-15',
      time: '18:00',
      place: 'Банкетный зал "Достар"',
      address: 'пр. Қабанбай батыр 11, Астана',
      emoji: '🎉',
    },
  ],
  dressCode: {
    ru: 'Пастельные тона, без белого.',
    kk: 'Пастель түстер, ақсыз.',
  },
  giftWishes: {
    ru: 'Ваше присутствие — лучший подарок.',
    kk: 'Сіздің қатысуыңыз — ең жақсы сыйлық.',
  },
  coordinatorName: 'Айгерим Касымова',
  coordinatorPhone: '+7 701 123 45 67',
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-04-08T14:30:00Z',
  published: true,
}

const seedGuests: Guest[] = [
  {
    id: 'g1',
    eventId: 'evt_001',
    name: 'Семья Нургалиевых',
    count: 4,
    side: 'bride',
    category: 'family',
    status: 'confirmed',
    phone: '+7 701 123 4567',
    token: 'nurgali',
    isVip: true,
    isElder: false,
    hasChildren: true,
    assignedStageIds: ['stg_1', 'stg_2', 'stg_3'],
    respondedAt: '2026-04-01T10:00:00Z',
    openedAt: '2026-03-28T09:00:00Z',
  },
  {
    id: 'g2',
    eventId: 'evt_001',
    name: 'Ержан Касымов',
    count: 1,
    side: 'groom',
    category: 'friends',
    status: 'confirmed',
    phone: '+7 702 234 5678',
    token: 'erzhan',
    isVip: false,
    isElder: false,
    hasChildren: false,
    assignedStageIds: ['stg_3'],
    respondedAt: '2026-04-02T15:00:00Z',
    openedAt: '2026-04-01T12:00:00Z',
  },
  {
    id: 'g3',
    eventId: 'evt_001',
    name: 'Семья Байтурсыновых',
    count: 3,
    side: 'bride',
    category: 'relatives',
    status: 'pending',
    phone: '+7 707 345 6789',
    token: 'baitur',
    isVip: false,
    isElder: true,
    hasChildren: false,
    assignedStageIds: ['stg_1', 'stg_2', 'stg_3'],
  },
  {
    id: 'g4',
    eventId: 'evt_001',
    name: 'Дана и Арман Сагиновы',
    count: 2,
    side: 'common',
    category: 'friends',
    status: 'declined',
    phone: '+7 700 456 7890',
    token: 'sagino',
    isVip: false,
    isElder: false,
    hasChildren: false,
    assignedStageIds: ['stg_3'],
    respondedAt: '2026-04-03T10:00:00Z',
    openedAt: '2026-04-02T09:00:00Z',
    comment: 'К сожалению, будем в отпуске.',
  },
  {
    id: 'g5',
    eventId: 'evt_001',
    name: 'Бауыржан Омаров',
    count: 1,
    side: 'groom',
    category: 'colleagues',
    status: 'maybe',
    phone: '+7 705 567 8901',
    token: 'bauyrzh',
    isVip: false,
    isElder: false,
    hasChildren: false,
    assignedStageIds: ['stg_3'],
    respondedAt: '2026-04-05T16:00:00Z',
    openedAt: '2026-04-04T11:00:00Z',
  },
  {
    id: 'g6',
    eventId: 'evt_001',
    name: 'Семья Алдабергеновых',
    count: 5,
    side: 'bride',
    category: 'relatives',
    status: 'confirmed',
    phone: '+7 708 678 9012',
    token: 'aldabe',
    isVip: true,
    isElder: true,
    hasChildren: true,
    assignedStageIds: ['stg_1', 'stg_2', 'stg_3'],
    respondedAt: '2026-03-30T08:00:00Z',
    openedAt: '2026-03-29T07:00:00Z',
  },
  {
    id: 'g7',
    eventId: 'evt_001',
    name: 'Мадина Ахметова',
    count: 1,
    side: 'common',
    category: 'friends',
    status: 'pending',
    phone: '+7 701 789 0123',
    token: 'madina',
    isVip: false,
    isElder: false,
    hasChildren: false,
    assignedStageIds: ['stg_3'],
  },
  {
    id: 'g8',
    eventId: 'evt_001',
    name: 'Семья Токтаровых',
    count: 3,
    side: 'groom',
    category: 'family',
    status: 'confirmed',
    phone: '+7 776 890 1234',
    token: 'toktar',
    isVip: true,
    isElder: false,
    hasChildren: true,
    assignedStageIds: ['stg_2', 'stg_3'],
    respondedAt: '2026-04-06T12:00:00Z',
    openedAt: '2026-04-05T10:00:00Z',
  },
  {
    id: 'g9',
    eventId: 'evt_001',
    name: 'Асель Жумабаева',
    count: 2,
    side: 'bride',
    category: 'friends',
    status: 'pending',
    phone: '+7 747 901 2345',
    token: 'aselzh',
    isVip: false,
    isElder: false,
    hasChildren: false,
    assignedStageIds: ['stg_1', 'stg_3'],
  },
  {
    id: 'g10',
    eventId: 'evt_001',
    name: 'Тимур Сейтказин',
    count: 1,
    side: 'groom',
    category: 'colleagues',
    status: 'confirmed',
    phone: '+7 702 012 3456',
    token: 'timurs',
    isVip: false,
    isElder: false,
    hasChildren: false,
    assignedStageIds: ['stg_3'],
    respondedAt: '2026-04-07T09:00:00Z',
    openedAt: '2026-04-06T08:00:00Z',
  },
]

let memoryDb: MockDatabase | null = null

function clone<T>(value: T) {
  return structuredClone(value)
}

function createSeedDb(): MockDatabase {
  return {
    events: [clone(seedEvent)],
    guests: clone(seedGuests),
    responses: {},
  }
}

function loadDb() {
  if (memoryDb) {
    return memoryDb
  }

  if (typeof window === 'undefined') {
    memoryDb = createSeedDb()
    return memoryDb
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    memoryDb = createSeedDb()
    persistDb()
    return memoryDb
  }

  try {
    memoryDb = JSON.parse(stored) as MockDatabase
  } catch {
    memoryDb = createSeedDb()
  }

  return memoryDb
}

function persistDb() {
  if (typeof window === 'undefined' || !memoryDb) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDb))
}

function nextId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export async function listEvents() {
  return clone(loadDb().events)
}

export async function getEventById(eventId: string) {
  const event = loadDb().events.find((item) => item.id === eventId)
  if (!event) {
    throw new Error('Event not found')
  }

  return clone(event)
}

export async function createEvent(input: CreateEventInput) {
  const db = loadDb()
  const now = new Date().toISOString()
  const event: Event = {
    ...clone(seedEvent),
    id: nextId('evt'),
    type: input.type,
    title: clone(input.title),
    templateStyle: input.templateStyle,
    languages: [...input.languages],
    createdAt: now,
    updatedAt: now,
    published: false,
  }

  db.events.unshift(event)
  persistDb()
  return clone(event)
}

export async function updateEvent(eventId: string, partial: Partial<Event>) {
  const db = loadDb()
  const index = db.events.findIndex((item) => item.id === eventId)

  if (index === -1) {
    throw new Error('Event not found')
  }

  db.events[index] = {
    ...db.events[index],
    ...clone(partial),
    id: eventId,
    updatedAt: new Date().toISOString(),
  }

  persistDb()
  return clone(db.events[index])
}

export async function listGuestsByEvent(eventId: string, filters?: GuestFilters) {
  const db = loadDb()
  let guests = db.guests.filter((guest) => guest.eventId === eventId)

  if (filters?.status) {
    guests = guests.filter((guest) => guest.status === filters.status)
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    guests = guests.filter((guest) => guest.name.toLowerCase().includes(search))
  }

  return clone(guests)
}

export async function getGuestByToken(token: string) {
  const guest = loadDb().guests.find((item) => item.token === token)

  if (!guest) {
    throw new Error('Guest not found')
  }

  return clone(guest)
}

export async function getInvitationByToken(token: string): Promise<InvitationPayload> {
  const db = loadDb()
  const guest = db.guests.find((item) => item.token === token)

  if (!guest) {
    throw new Error('Invitation not found')
  }

  const event = db.events.find((item) => item.id === guest.eventId)

  if (!event) {
    throw new Error('Event not found')
  }

  return {
    event: clone(event),
    guest: clone(guest),
    visibleStages: clone(getVisibleStages(event, guest)),
    response: db.responses[token] ? clone(db.responses[token]) : null,
    invitationUrl: buildInvitationPath(token),
  }
}

export async function markInvitationOpened(token: string) {
  const db = loadDb()
  const guestIndex = db.guests.findIndex((item) => item.token === token)

  if (guestIndex >= 0) {
    db.guests[guestIndex] = {
      ...db.guests[guestIndex],
      openedAt: new Date().toISOString(),
    }
    persistDb()
  }
}

export async function submitRsvp(input: RsvpSubmitInput) {
  const db = loadDb()
  const guestIndex = db.guests.findIndex((item) => item.token === input.token)

  if (guestIndex === -1) {
    throw new Error('Guest not found')
  }

  const guest = db.guests[guestIndex]
  const response: RsvpResponse = {
    guestId: guest.id,
    status: input.status,
    count: input.count ?? guest.count,
    needsTransfer: input.needsTransfer ?? false,
    hasChildren: input.hasChildren ?? guest.hasChildren,
    dietaryRestrictions: input.dietaryRestrictions,
    comment: input.comment,
  }

  db.responses[input.token] = response
  db.guests[guestIndex] = {
    ...guest,
    status: input.status,
    count: response.count,
    comment: input.comment,
    respondedAt: new Date().toISOString(),
  }

  persistDb()
  return clone(response)
}

export async function getEventStatsById(eventId: string) {
  return getEventStats(await listGuestsByEvent(eventId))
}

export const demoEventId = seedEvent.id
