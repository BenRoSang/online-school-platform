import { AppError } from '../../shared/errors/app-error.js'
import { CourseRepository } from './course.repository.js'
import type { PublicCourseDetails, PublicCourseSummary } from './course.types.js'

type CourseRecord = Awaited<ReturnType<CourseRepository['findPublishedCourseBySlug']>>

function summarizeCourse(course: NonNullable<CourseRecord>): PublicCourseSummary {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    teacherName: course.teacher.fullName,
    sectionCount: course.sections.length,
    lessonCount: course.sections.reduce((total, section) => total + section.lessons.length, 0),
  }
}

export class CourseService {
  constructor(private readonly repository = new CourseRepository()) {}

  async listPublishedCourses(search: string): Promise<PublicCourseSummary[]> {
    const courses = await this.repository.findPublishedCourses(search)
    return courses.map(summarizeCourse)
  }

  async getPublishedCourse(slug: string): Promise<PublicCourseDetails> {
    const course = await this.repository.findPublishedCourseBySlug(slug)
    if (!course) {
      throw new AppError(404, 'COURSE_NOT_FOUND', 'Published course was not found')
    }

    return {
      ...summarizeCourse(course),
      sections: course.sections,
    }
  }
}
