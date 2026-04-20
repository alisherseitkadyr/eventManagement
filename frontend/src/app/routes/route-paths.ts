
export const routePaths = {
  landing: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  templates: '/templates',
  templatePreview: '/templates/:templateId',
  myEvents: '/my-events',
  dashboard: '/dashboard',
  eventCreate: '/events/new',
  eventDetails: '/events/:eventId',
  eventEdit: '/events/:eventId/edit',
  eventConstructor: '/events/:eventId/constructor',
  eventGuests: '/events/:eventId/guests',
  eventPreview: '/events/:eventId/preview',
  invitationPublic: '/invite/:token',
  notFound: '/404',
} as const

export const routeBuilders = {
  templatePreview: (templateId: string) => `/templates/${templateId}`,
  eventDetails: (eventId: string) => `/events/${eventId}`,
  eventEdit: (eventId: string) => `/events/${eventId}/edit`,
  eventConstructor: (eventId: string) => `/events/${eventId}/constructor`,
  eventGuests: (eventId: string) => `/events/${eventId}/guests`,
  eventPreview: (eventId: string) => `/events/${eventId}/preview`,
  invitationPublic: (token: string) => `/invite/${token}`,
} as const
