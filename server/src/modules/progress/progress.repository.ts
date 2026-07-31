import { getDatabase } from '../../config/database.js'

export class ProgressRepository {
  findEnrolledLesson(studentId: string, lessonId: string) {
    return getDatabase().lesson.findFirst({
      where: {
        id: lessonId,
        section: { course: { enrolments: { some: { studentId } } } },
      },
      select: { id: true },
    })
  }

  save(studentId: string, lessonId: string, completed: boolean) {
    return getDatabase().lessonProgress.upsert({
      where: { studentId_lessonId: { studentId, lessonId } },
      create: {
        studentId,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      select: { lessonId: true, completed: true, completedAt: true },
    })
  }
}
