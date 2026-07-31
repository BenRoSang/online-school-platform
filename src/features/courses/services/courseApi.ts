import type { CourseDetails, CourseSummary } from '../types/course'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface ErrorResponse {
  error?: { message?: string }
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`)
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ErrorResponse
    throw new Error(body.error?.message ?? 'The courses could not be loaded')
  }
  return response.json() as Promise<T>
}

export const courseApi = {
  async list(search: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : ''
    const response = await get<{ data: { courses: CourseSummary[] } }>(`/courses${query}`)
    return response.data.courses
  },

  async getBySlug(slug: string) {
    const response = await get<{ data: { course: CourseDetails } }>(
      `/courses/${encodeURIComponent(slug)}`,
    )
    return response.data.course
  },
}
