import type { CourseSummary } from '../../courses/types/course'

export interface EnrolledCourse extends CourseSummary {
  enrolmentId: string
  enrolledAt: string
}
