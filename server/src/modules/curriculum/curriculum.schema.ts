import { z } from 'zod'

const youtubeIdPattern = /^[A-Za-z0-9_-]{11}$/

export function extractYouTubeId(value: string): string | null {
  const trimmed = value.trim()
  if (youtubeIdPattern.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    if (url.hostname === 'youtu.be') return youtubeIdPattern.test(url.pathname.slice(1)) ? url.pathname.slice(1) : null
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      const id = url.pathname.startsWith('/shorts/') ? url.pathname.split('/')[2] : url.searchParams.get('v')
      return id && youtubeIdPattern.test(id) ? id : null
    }
  } catch {
    return null
  }
  return null
}

const ids = { courseId: z.uuid(), sectionId: z.uuid(), lessonId: z.uuid() }
const request = <P extends z.ZodType, B extends z.ZodType>(params: P, body: B) => z.object({ params, body, query: z.object({}) })
const noBody = z.unknown().optional()
const sectionBody = z.object({ title: z.string().trim().min(2).max(160) })
const lessonBody = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(10_000),
  youtubeVideoId: z.string().trim().transform((value, context) => {
    const id = extractYouTubeId(value)
    if (!id) { context.addIssue({ code: 'custom', message: 'Enter a valid YouTube video ID or URL' }); return z.NEVER }
    return id
  }),
  isPreview: z.boolean(),
})

export const courseCurriculumSchema = request(z.object({ courseId: ids.courseId }), noBody)
export const sectionSchema = request(z.object({ courseId: ids.courseId }), sectionBody)
export const sectionItemSchema = request(z.object({ courseId: ids.courseId, sectionId: ids.sectionId }), sectionBody)
export const deleteSectionSchema = request(z.object({ courseId: ids.courseId, sectionId: ids.sectionId }), noBody)
export const reorderSectionsSchema = request(z.object({ courseId: ids.courseId }), z.object({ sectionIds: z.array(z.uuid()).min(1) }))
export const lessonSchema = request(z.object({ courseId: ids.courseId, sectionId: ids.sectionId }), lessonBody)
export const lessonItemSchema = request(z.object({ courseId: ids.courseId, lessonId: ids.lessonId }), lessonBody)
export const deleteLessonSchema = request(z.object({ courseId: ids.courseId, lessonId: ids.lessonId }), noBody)
export const reorderLessonsSchema = request(z.object({ courseId: ids.courseId, sectionId: ids.sectionId }), z.object({ lessonIds: z.array(z.uuid()).min(1) }))

export type ValidatedCurriculumRequest<T extends z.ZodType> = z.infer<T>
