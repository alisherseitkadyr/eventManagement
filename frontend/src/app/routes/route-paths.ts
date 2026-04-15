
export const routePaths = {
  landing: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  templates: '/templates',
  templatePreview: '/templates/:templateId',
  dashboard: '/dashboard',
  eventCreate: '/events/new',
  eventDetails: '/events/:eventId',
  eventEdit: '/events/:eventId/edit',
  eventConstructor: '/events/:eventId/constructor',
  eventGuests: '/events/:eventId/guests',
  eventStages: '/events/:eventId/stages',
  eventPreview: '/events/:eventId/preview',
  eventSending: '/events/:eventId/sending',
  invitationPublic: '/invite/:token',
  notFound: '/404',
} as const

export const routeBuilders = {
  templatePreview: (templateId: string) => `/templates/${templateId}`,
  eventDetails: (eventId: string) => `/events/${eventId}`,
  eventEdit: (eventId: string) => `/events/${eventId}/edit`,
  eventConstructor: (eventId: string) => `/events/${eventId}/constructor`,
  eventGuests: (eventId: string) => `/events/${eventId}/guests`,
  eventStages: (eventId: string) => `/events/${eventId}/stages`,
  eventPreview: (eventId: string) => `/events/${eventId}/preview`,
  eventSending: (eventId: string) => `/events/${eventId}/sending`,
  invitationPublic: (token: string) => `/invite/${token}`,
} as const
