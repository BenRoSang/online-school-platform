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

const courseFields = {
  title: z.string().trim().min(3).max(160),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL-friendly slug'),
  description: z.string().trim().min(20).max(10_000),
  thumbnailUrl: z.union([z.url().max(2_000), z.literal('')]).transform((value) => value || null),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
}

export const createTeacherCourseSchema = z.object({
  body: z.object(courseFields),
  params: z.object({}),
  query: z.object({}),
})

export const updateTeacherCourseSchema = z.object({
  body: z.object(courseFields),
  params: z.object({ id: z.uuid() }),
  query: z.object({}),
})

export const teacherCourseIdSchema = z.object({
  body: z.unknown().optional(),
  params: z.object({ id: z.uuid() }),
  query: z.object({}),
})

export type CreateTeacherCourseRequest = z.infer<typeof createTeacherCourseSchema>
export type UpdateTeacherCourseRequest = z.infer<typeof updateTeacherCourseSchema>
export type TeacherCourseIdRequest = z.infer<typeof teacherCourseIdSchema>
