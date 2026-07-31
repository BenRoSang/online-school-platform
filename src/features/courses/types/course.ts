export interface CourseSummary {
  id: string
  title: string
  slug: string
  description: string
  thumbnailUrl: string | null
  teacherName: string
  sectionCount: number
  lessonCount: number
}

export interface CourseLesson {
  id: string
  title: string
  description: string
  position: number
  isPreview: boolean
}

export interface CourseSection {
  id: string
  title: string
  position: number
  lessons: CourseLesson[]
}

export interface CourseDetails extends CourseSummary {
  sections: CourseSection[]
}

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface TeacherCourse {
  id: string
  title: string
  slug: string
  description: string
  thumbnailUrl: string | null
  status: CourseStatus
  sectionCount: number
  lessonCount: number
  createdAt: string
  updatedAt: string
}

export interface CourseInput {
  title: string
  slug: string
  description: string
  thumbnailUrl: string
  status: CourseStatus
}
