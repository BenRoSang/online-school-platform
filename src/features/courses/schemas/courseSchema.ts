import { z } from 'zod'

export const courseSchema = z.object({
  title: z.string().trim().min(3, 'Enter at least 3 characters').max(160),
  slug: z.string().trim().min(3, 'Enter at least 3 characters').max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens'),
  description: z.string().trim().min(20, 'Enter at least 20 characters').max(10_000),
  thumbnailUrl: z.union([z.string().trim().url('Enter a valid URL'), z.literal('')]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

export type CourseFormValues = z.infer<typeof courseSchema>

export function slugifyTitle(title: string) {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
