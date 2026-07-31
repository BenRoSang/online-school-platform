import { AppError } from '../../shared/errors/app-error.js'
import { EnrolmentRepository } from './enrolment.repository.js'
import type { EnrolledCourse } from './enrolment.types.js'

export class EnrolmentService {
  constructor(private readonly repository = new EnrolmentRepository()) {}

  async enrol(studentId: string, courseId: string): Promise<void> {
    if (!(await this.repository.findPublishedCourse(courseId))) {
      throw new AppError(404, 'COURSE_NOT_FOUND', 'Published course was not found')
    }
    if ((await this.repository.create(studentId, courseId)).count !== 1) {
      throw new AppError(409, 'ALREADY_ENROLLED', 'You are already enrolled in this course')
    }
  }

  async listForStudent(studentId: string): Promise<EnrolledCourse[]> {
    return (await this.repository.findForStudent(studentId)).map((enrolment) => ({
      enrolmentId: enrolment.id,
      enrolledAt: enrolment.enrolledAt,
      id: enrolment.course.id,
      title: enrolment.course.title,
      slug: enrolment.course.slug,
      description: enrolment.course.description,
      thumbnailUrl: enrolment.course.thumbnailUrl,
      teacherName: enrolment.course.teacher.fullName,
      sectionCount: enrolment.course.sections.length,
      lessonCount: enrolment.course.sections.reduce(
        (total, section) => total + section._count.lessons,
        0,
      ),
      firstLessonId: enrolment.course.sections.find((section) => section.lessons[0])?.lessons[0]?.id ?? null,
      completedLessonCount: enrolment.course.sections.reduce(
        (total, section) => total + section.lessons.filter((lesson) => lesson.progress.length > 0).length,
        0,
      ),
      progressPercentage: (() => {
        const total = enrolment.course.sections.reduce((sum, section) => sum + section.lessons.length, 0)
        const completed = enrolment.course.sections.reduce(
          (sum, section) => sum + section.lessons.filter((lesson) => lesson.progress.length > 0).length,
          0,
        )
        return total === 0 ? 0 : Math.round((completed / total) * 100)
      })(),
    }))
  }
}
