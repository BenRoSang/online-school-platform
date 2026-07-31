export interface PublicCourseSummary {
  id: string
  title: string
  slug: string
  description: string
  thumbnailUrl: string | null
  teacherName: string
  sectionCount: number
  lessonCount: number
}

export interface PublicLesson {
  id: string
  title: string
  description: string
  position: number
  isPreview: boolean
}

export interface PublicCourseSection {
  id: string
  title: string
  position: number
  lessons: PublicLesson[]
}

export interface PublicCourseDetails extends PublicCourseSummary {
  sections: PublicCourseSection[]
}
