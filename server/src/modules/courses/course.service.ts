import { AppError } from '../../shared/errors/app-error.js'
import { CourseRepository } from './course.repository.js'
import { CourseStatus } from '../../generated/prisma/client.js'
import type {
  PublicCourseDetails,
  PublicCourseSummary,
  TeacherCourse,
} from './course.types.js'

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

type TeacherCourseRecord = Awaited<ReturnType<CourseRepository['findTeacherCourseById']>>

function toTeacherCourse(course: NonNullable<TeacherCourseRecord>): TeacherCourse {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    status: course.status,
    sectionCount: course.sections.length,
    lessonCount: course.sections.reduce((total, section) => total + section._count.lessons, 0),
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  }
}

interface CourseWriteInput {
  title: string
  slug: string
  description: string
  thumbnailUrl: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
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

  async listTeacherCourses(teacherId: string): Promise<TeacherCourse[]> {
    return (await this.repository.findTeacherCourses(teacherId)).map(toTeacherCourse)
  }

  async getTeacherCourse(id: string, teacherId: string): Promise<TeacherCourse> {
    const course = await this.repository.findTeacherCourseById(id, teacherId)
    if (!course) throw new AppError(404, 'COURSE_NOT_FOUND', 'Course was not found')
    return toTeacherCourse(course)
  }

  async createTeacherCourse(teacherId: string, input: CourseWriteInput): Promise<TeacherCourse> {
    await this.ensureSlugAvailable(input.slug)
    return toTeacherCourse(
      await this.repository.createTeacherCourse(teacherId, {
        ...input,
        status: CourseStatus[input.status],
      }),
    )
  }

  async updateTeacherCourse(id: string, teacherId: string, input: CourseWriteInput): Promise<TeacherCourse> {
    const existingCourse = await this.repository.findTeacherCourseById(id, teacherId)
    if (!existingCourse) throw new AppError(404, 'COURSE_NOT_FOUND', 'Course was not found')

    if (existingCourse.slug !== input.slug) await this.ensureSlugAvailable(input.slug)
    return toTeacherCourse(
      await this.repository.updateTeacherCourse(id, teacherId, {
        ...input,
        status: CourseStatus[input.status],
      }),
    )
  }

  async deleteTeacherCourse(id: string, teacherId: string): Promise<void> {
    const existingCourse = await this.repository.findTeacherCourseById(id, teacherId)
    if (!existingCourse) throw new AppError(404, 'COURSE_NOT_FOUND', 'Course was not found')
    if (existingCourse.status !== CourseStatus.DRAFT) {
      throw new AppError(409, 'COURSE_NOT_DRAFT', 'Only draft courses can be deleted')
    }
    const result = await this.repository.deleteDraftTeacherCourse(id, teacherId)
    if (result.count !== 1) throw new AppError(409, 'COURSE_DELETE_CONFLICT', 'Course could not be deleted')
  }

  private async ensureSlugAvailable(slug: string): Promise<void> {
    if (await this.repository.findCourseBySlug(slug)) {
      throw new AppError(409, 'SLUG_ALREADY_EXISTS', 'Another course already uses this slug')
    }
  }
}
