import type { LessonPlayerData } from '../types/learning'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export class LearningApiError extends Error {
  readonly status: number
  constructor(message: string, status: number) { super(message); this.name = 'LearningApiError'; this.status = status }
}

export async function getLesson(slug: string, lessonId: string, token: string | null) {
  const response = await fetch(`${apiUrl}/learning/courses/${encodeURIComponent(slug)}/lessons/${lessonId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
    throw new LearningApiError(body.error?.message ?? 'The lesson could not be loaded', response.status)
  }
  return (await response.json() as { data: LessonPlayerData }).data
}
