import { z } from 'zod'

export const updateProgressSchema = z.object({
  body: z.object({ completed: z.boolean() }),
  params: z.object({ lessonId: z.uuid() }),
  query: z.object({}),
})

export type UpdateProgressRequest = z.infer<typeof updateProgressSchema>
