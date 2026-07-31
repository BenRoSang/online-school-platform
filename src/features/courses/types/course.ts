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
