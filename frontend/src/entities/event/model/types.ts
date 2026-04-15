export type EventLanguage = 'ru' | 'kk'

export type EventType =
  | 'wedding'
  | 'qyz_uzatu'
  | 'betashar'
  | 'qudalyq'
  | 'anniversary'
  | 'sundet_toi'
  | 'birthday'
  | 'tusau_kesu'
  | 'other'

export type TemplateStyle = 'modern' | 'elegant' | 'national'

export type LocalizedText = Record<EventLanguage, string>

export type EventStage = {
  id: string
  name: LocalizedText
  date: string
  time: string
  place: string
  address: string
  emoji?: string
}

export type Event = {
  id: string
  type: EventType
  templateStyle: TemplateStyle
  languages: EventLanguage[]
  accentColor: string
  title: LocalizedText
  subtitle?: LocalizedText
  description?: LocalizedText
  stages: EventStage[]
  dressCode?: LocalizedText
  giftWishes?: LocalizedText
  coordinatorName: string
  coordinatorPhone: string
  createdAt: string
  updatedAt: string
  published: boolean
}

export type EventStats = {
  totalGuests: number
  totalPeople: number
  confirmed: number
  confirmedPeople: number
  declined: number
  maybe: number
  pending: number
}

export type CreateEventInput = {
  type: EventType
  title: LocalizedText
  templateStyle: TemplateStyle
  languages: EventLanguage[]
}

export const eventTypes = [
  'wedding',
  'qyz_uzatu',
  'betashar',
  'qudalyq',
  'anniversary',
  'sundet_toi',
  'birthday',
  'tusau_kesu',
  'other',
] as const satisfies readonly EventType[]

export const eventLanguages = ['ru', 'kk'] as const satisfies readonly EventLanguage[]

export const templateStyles = [
  'elegant',
  'modern',
  'national',
] as const satisfies readonly TemplateStyle[]

export const eventTypeLabels: Record<EventType, LocalizedText> = {
  wedding: { ru: 'Свадьба / Той', kk: 'Той' },
  qyz_uzatu: { ru: 'Қыз ұзату', kk: 'Қыз ұзату' },
  betashar: { ru: 'Беташар', kk: 'Беташар' },
  qudalyq: { ru: 'Құдалық', kk: 'Құдалық' },
  anniversary: { ru: 'Юбилей', kk: 'Мерейтой' },
  sundet_toi: { ru: 'Сүндет той', kk: 'Сүндет той' },
  birthday: { ru: 'День рождения', kk: 'Туған күн' },
  tusau_kesu: { ru: 'Тұсау кесу', kk: 'Тұсау кесу' },
  other: { ru: 'Другое', kk: 'Басқа' },
}

export const eventTypeEmojis: Record<EventType, string> = {
  wedding: '💍',
  qyz_uzatu: '👰',
  betashar: '🪭',
  qudalyq: '🤝',
  anniversary: '✨',
  sundet_toi: '🎉',
  birthday: '🎂',
  tusau_kesu: '👣',
  other: '📌',
}

export const templateStyleLabels: Record<
  TemplateStyle,
  { title: string; description: string }
> = {
  elegant: {
    title: 'Elegant',
    description: 'Утонченный минимализм с золотыми акцентами и мягкой типографикой.',
  },
  modern: {
    title: 'Modern',
    description: 'Современный и чистый стиль с аккуратными акцентами.',
  },
  national: {
    title: 'National',
    description: 'Теплая казахская стилистика с церемониальным настроением.',
  },
}
