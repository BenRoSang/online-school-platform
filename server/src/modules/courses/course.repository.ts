import { CourseStatus } from '../../generated/prisma/client.js'
import { getDatabase } from '../../config/database.js'

const publicCourseSelection = {
  id: true,
  title: true,
  slug: true,
  description: true,
  thumbnailUrl: true,
  teacher: { select: { fullName: true } },
  sections: {
    select: {
      id: true,
      title: true,
      position: true,
      lessons: {
        select: {
          id: true,
          title: true,
          description: true,
          position: true,
          isPreview: true,
        },
        orderBy: { position: 'asc' as const },
      },
    },
    orderBy: { position: 'asc' as const },
  },
} as const

const teacherCourseSelection = {
  id: true,
  title: true,
  slug: true,
  description: true,
  thumbnailUrl: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  sections: { select: { _count: { select: { lessons: true } } } },
} as const

export class CourseRepository {
  findPublishedCourses(search: string) {
    return getDatabase().course.findMany({
      where: {
        status: CourseStatus.PUBLISHED,
        ...(search
          ? { title: { contains: search, mode: 'insensitive' as const } }
          : {}),
      },
      select: publicCourseSelection,
      orderBy: { createdAt: 'desc' },
    })
  }

  findPublishedCourseBySlug(slug: string) {
    return getDatabase().course.findFirst({
      where: { slug, status: CourseStatus.PUBLISHED },
      select: publicCourseSelection,
    })
  }

  findTeacherCourses(teacherId: string) {
    return getDatabase().course.findMany({
      where: { teacherId },
      select: teacherCourseSelection,
      orderBy: { updatedAt: 'desc' },
    })
  }

  findTeacherCourseById(id: string, teacherId: string) {
    return getDatabase().course.findFirst({
      where: { id, teacherId },
      select: teacherCourseSelection,
    })
  }

  findCourseBySlug(slug: string) {
    return getDatabase().course.findUnique({ where: { slug }, select: { id: true } })
  }

  createTeacherCourse(teacherId: string, data: {
    title: string
    slug: string
    description: string
    thumbnailUrl: string | null
    status: CourseStatus
  }) {
    return getDatabase().course.create({
      data: { ...data, teacherId },
      select: teacherCourseSelection,
    })
  }

  updateTeacherCourse(id: string, teacherId: string, data: {
    title: string
    slug: string
    description: string
    thumbnailUrl: string | null
    status: CourseStatus
  }) {
    return getDatabase().course.update({
      where: { id, teacherId },
      data,
      select: teacherCourseSelection,
    })
  }

  deleteDraftTeacherCourse(id: string, teacherId: string) {
    return getDatabase().course.deleteMany({
      where: { id, teacherId, status: CourseStatus.DRAFT },
    })
  }
}
