import { z } from 'zod'

export const listPublicCoursesSchema = z.object({
  body: z.unknown().optional(),
  params: z.object({}),
  query: z.object({
    search: z.string().trim().max(100).optional().default(''),
  }),
})

export const getPublicCourseSchema = z.object({
  body: z.unknown().optional(),
  params: z.object({
    slug: z.string().trim().min(1).max(180),
  }),
  query: z.object({}),
})

export type ListPublicCoursesRequest = z.infer<typeof listPublicCoursesSchema>
export type GetPublicCourseRequest = z.infer<typeof getPublicCourseSchema>
