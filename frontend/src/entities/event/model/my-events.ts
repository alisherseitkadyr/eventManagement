export interface MyEvent {
  id: string
  title: string
  date: string
  time?: string
  location?: string
  status: 'draft' | 'published' | 'archived'
  templateId: string
  previewImage?: string
  rsvpCount?: number
  createdAt: string
}

export interface EventFull extends MyEvent {
  templateName?: string
  description?: string
  hostName?: string
  guestList?: Guest[]
  settings?: EventSettings
}

export interface Guest {
  id: string
  name: string
  email?: string
  status: 'pending' | 'confirmed' | 'declined'
  plusOnes?: number
}

export interface EventSettings {
  isPrivate: boolean
  allowPlusOnes: boolean
  maxGuests?: number
  rsvpDeadline?: string
}
