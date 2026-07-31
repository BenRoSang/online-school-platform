import { z } from 'zod'

export const lessonPlayerSchema = z.object({
  body: z.unknown().optional(),
  params: z.object({ slug: z.string().trim().min(1).max(180), lessonId: z.uuid() }),
  query: z.object({}),
})

export type LessonPlayerRequest = z.infer<typeof lessonPlayerSchema>
