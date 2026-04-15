import { z } from 'zod'
import { eventLanguages, eventTypes, templateStyles } from '@entities/event/model/types'

export const eventFormSchema = z.object({
  type: z.enum(eventTypes, { message: 'Select event type' }),
  titleRu: z.string().min(2, 'Add a Russian title'),
  titleKk: z.string().min(2, 'Add a Kazakh title'),
  languages: z
    .array(z.enum(eventLanguages))
    .min(1, 'Select at least one invitation language'),
  templateStyle: z.enum(templateStyles, { message: 'Select a template style' }),
})

export type EventFormValues = z.infer<typeof eventFormSchema>
