export interface PlayerLessonItem { id: string; title: string; position: number; isPreview: boolean; accessible: boolean; completed: boolean }
export interface PlayerSection { id: string; title: string; position: number; lessons: PlayerLessonItem[] }
export interface LessonPlayerData {
  course: { id: string; title: string; slug: string; sections: PlayerSection[] }
  lesson: { id: string; title: string; description: string; youtubeVideoId: string; position: number; isPreview: boolean }
  enrolled: boolean
  completed: boolean
  completedLessonCount: number
  totalLessonCount: number
  progressPercentage: number
  previousLessonId: string | null
  nextLessonId: string | null
}
