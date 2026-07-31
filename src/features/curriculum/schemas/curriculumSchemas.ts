import { z } from 'zod'

export const sectionFormSchema = z.object({ title: z.string().trim().min(2, 'Enter at least 2 characters').max(160) })
export const lessonFormSchema = z.object({
  title: z.string().trim().min(2, 'Enter at least 2 characters').max(160),
  description: z.string().trim().min(10, 'Enter at least 10 characters').max(10_000),
  youtubeVideoId: z.string().trim().min(1, 'Enter a YouTube video ID or URL'),
  isPreview: z.boolean(),
})
export type SectionFormValues = z.infer<typeof sectionFormSchema>
export type LessonFormValues = z.infer<typeof lessonFormSchema>
