import type { Role } from '../../generated/prisma/client.js'
import { AppError } from '../../shared/errors/app-error.js'
import { LearningRepository } from './learning.repository.js'

export class LearningService {
  constructor(private readonly repository = new LearningRepository()) {}

  async getLesson(slug: string, lessonId: string, auth?: { userId: string; role: Role }) {
    const course = await this.repository.findPublishedCourse(slug)
    if (!course) throw new AppError(404, 'COURSE_NOT_FOUND', 'Published course was not found')

    const orderedLessons = course.sections.flatMap((section) => section.lessons)
    const selectedIndex = orderedLessons.findIndex((lesson) => lesson.id === lessonId)
    if (selectedIndex === -1) throw new AppError(404, 'LESSON_NOT_FOUND', 'Lesson was not found')

    const enrolled = auth?.role === 'STUDENT'
      ? Boolean(await this.repository.findEnrolment(auth.userId, course.id))
      : false
    const selectedLesson = orderedLessons[selectedIndex]!
    if (!selectedLesson.isPreview && !enrolled) {
      throw new AppError(403, 'ENROLMENT_REQUIRED', 'Enrolment is required for this lesson')
    }

    const accessibleLessons = orderedLessons.filter((lesson) => enrolled || lesson.isPreview)
    const navigationIndex = accessibleLessons.findIndex((lesson) => lesson.id === lessonId)
    return {
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        sections: course.sections.map((section) => ({
          ...section,
          lessons: section.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            position: lesson.position,
            isPreview: lesson.isPreview,
            accessible: enrolled || lesson.isPreview,
          })),
        })),
      },
      lesson: selectedLesson,
      enrolled,
      previousLessonId: accessibleLessons[navigationIndex - 1]?.id ?? null,
      nextLessonId: accessibleLessons[navigationIndex + 1]?.id ?? null,
    }
  }
}
