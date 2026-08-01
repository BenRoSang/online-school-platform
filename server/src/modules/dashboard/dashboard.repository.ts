import { getDatabase } from '../../config/database.js'

export class DashboardRepository {
  findStudentCourses(studentId: string) {
    return getDatabase().enrolment.findMany({
      where: { studentId },
      select: {
        course: {
          select: {
            sections: {
              select: {
                lessons: {
                  select: {
                    progress: {
                      where: { studentId, completed: true },
                      select: { id: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  findTeacherCourses(teacherId: string) {
    return getDatabase().course.findMany({
      where: { teacherId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        updatedAt: true,
        enrolments: { select: { studentId: true } },
      },
    })
  }
}
