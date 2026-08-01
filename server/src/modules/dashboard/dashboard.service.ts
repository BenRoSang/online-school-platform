import { CourseStatus } from '../../generated/prisma/client.js'
import { DashboardRepository } from './dashboard.repository.js'

export class DashboardService {
  constructor(private readonly repository = new DashboardRepository()) {}

  async student(studentId: string) {
    const enrolments = await this.repository.findStudentCourses(studentId)
    const courseStats = enrolments.map(({ course }) => {
      const lessons = course.sections.flatMap((section) => section.lessons)
      const completed = lessons.filter((lesson) => lesson.progress.length > 0).length
      return { total: lessons.length, completed }
    })
    return {
      enrolledCourseCount: enrolments.length,
      coursesInProgress: courseStats.filter(({ total, completed }) => completed > 0 && completed < total).length,
      completedLessons: courseStats.reduce((total, course) => total + course.completed, 0),
    }
  }

  async teacher(teacherId: string) {
    const courses = await this.repository.findTeacherCourses(teacherId)
    const studentIds = new Set(courses.flatMap((course) => course.enrolments.map((item) => item.studentId)))
    return {
      totalCourses: courses.length,
      publishedCourses: courses.filter((course) => course.status === CourseStatus.PUBLISHED).length,
      draftCourses: courses.filter((course) => course.status === CourseStatus.DRAFT).length,
      totalEnrolledStudents: studentIds.size,
      recentlyUpdatedCourses: courses.slice(0, 5).map((course) => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        status: course.status,
        updatedAt: course.updatedAt,
      })),
    }
  }
}
