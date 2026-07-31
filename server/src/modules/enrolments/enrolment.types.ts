export interface EnrolledCourse {
  enrolmentId: string
  enrolledAt: Date
  id: string
  title: string
  slug: string
  description: string
  thumbnailUrl: string | null
  teacherName: string
  sectionCount: number
  lessonCount: number
  firstLessonId: string | null
  completedLessonCount: number
  progressPercentage: number
}
