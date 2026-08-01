export interface StudentDashboardSummary {
  enrolledCourseCount: number
  coursesInProgress: number
  completedLessons: number
}

export interface TeacherDashboardSummary {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalEnrolledStudents: number
  recentlyUpdatedCourses: Array<{
    id: string
    title: string
    slug: string
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    updatedAt: string
  }>
}
