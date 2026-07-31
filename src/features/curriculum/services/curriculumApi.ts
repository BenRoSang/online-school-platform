import type { Curriculum, LessonInput } from '../types/curriculum'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
async function request<T>(courseId: string, path: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl}/teacher/courses/${courseId}/curriculum${path}`, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...init.headers } })
  if (!response.ok) { const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } }; throw new Error(body.error?.message ?? 'The curriculum request failed') }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
const json = (method: string, body: unknown): RequestInit => ({ method, body: JSON.stringify(body) })
export const curriculumApi = {
  get: async (courseId: string, token: string) => (await request<{ data: { curriculum: Curriculum } }>(courseId, '', token)).data.curriculum,
  addSection: (courseId: string, title: string, token: string) => request(courseId, '/sections', token, json('POST', { title })),
  editSection: (courseId: string, sectionId: string, title: string, token: string) => request(courseId, `/sections/${sectionId}`, token, json('PUT', { title })),
  deleteSection: (courseId: string, sectionId: string, token: string) => request(courseId, `/sections/${sectionId}`, token, { method: 'DELETE' }),
  reorderSections: (courseId: string, sectionIds: string[], token: string) => request(courseId, '/sections/order', token, json('PUT', { sectionIds })),
  addLesson: (courseId: string, sectionId: string, input: LessonInput, token: string) => request(courseId, `/sections/${sectionId}/lessons`, token, json('POST', input)),
  editLesson: (courseId: string, lessonId: string, input: LessonInput, token: string) => request(courseId, `/lessons/${lessonId}`, token, json('PUT', input)),
  deleteLesson: (courseId: string, lessonId: string, token: string) => request(courseId, `/lessons/${lessonId}`, token, { method: 'DELETE' }),
  reorderLessons: (courseId: string, sectionId: string, lessonIds: string[], token: string) => request(courseId, `/sections/${sectionId}/lessons/order`, token, json('PUT', { lessonIds })),
}
