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
}
