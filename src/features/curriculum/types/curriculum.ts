export interface CurriculumLesson { id: string; title: string; description: string; youtubeVideoId: string; position: number; isPreview: boolean }
export interface CurriculumSection { id: string; title: string; position: number; lessons: CurriculumLesson[] }
export interface Curriculum { id: string; title: string; slug: string; sections: CurriculumSection[] }
export interface LessonInput { title: string; description: string; youtubeVideoId: string; isPreview: boolean }
