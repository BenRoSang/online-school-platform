import { CourseStatus } from '../../generated/prisma/client.js'
import { getDatabase } from '../../config/database.js'

export class EnrolmentRepository {
  findPublishedCourse(courseId: string) {
    return getDatabase().course.findFirst({
      where: { id: courseId, status: CourseStatus.PUBLISHED },
      select: { id: true },
    })
  }

  async create(studentId: string, courseId: string) {
    return getDatabase().enrolment.createMany({
      data: { studentId, courseId },
      skipDuplicates: true,
    })
  }

  findForStudent(studentId: string) {
    return getDatabase().enrolment.findMany({
      where: { studentId },
      orderBy: { enrolledAt: 'desc' },
      select: {
        id: true,
        enrolledAt: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            thumbnailUrl: true,
            teacher: { select: { fullName: true } },
            sections: {
              orderBy: { position: 'asc' },
              select: {
                _count: { select: { lessons: true } },
                lessons: { orderBy: { position: 'asc' }, take: 1, select: { id: true } },
              },
            },
          },
        },
      },
    })
  }
}
