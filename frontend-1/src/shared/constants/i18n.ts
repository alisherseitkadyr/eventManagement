export const SUPPORTED_LANGUAGES = ['ru', 'kk'] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'ru'
