import { z } from 'zod'

export const createEnrolmentSchema = z.object({
  body: z.object({ courseId: z.uuid() }),
  params: z.object({}),
  query: z.object({}),
})

export type CreateEnrolmentRequest = z.infer<typeof createEnrolmentSchema>
