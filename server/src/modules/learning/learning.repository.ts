import { CourseStatus } from '../../generated/prisma/client.js'
import { getDatabase } from '../../config/database.js'

export class LearningRepository {
  findPublishedCourse(slug: string) {
    return getDatabase().course.findFirst({
      where: { slug, status: CourseStatus.PUBLISHED },
      select: {
        id: true,
        title: true,
        slug: true,
        sections: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            position: true,
            lessons: {
              orderBy: { position: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                youtubeVideoId: true,
                position: true,
                isPreview: true,
              },
            },
          },
        },
      },
    })
  }

  findEnrolment(studentId: string, courseId: string) {
    return getDatabase().enrolment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
      select: { id: true },
    })
  }
}
