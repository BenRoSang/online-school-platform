import type { CourseInput, TeacherCourse } from '../types/course'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl}/teacher/courses${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...init.headers },
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
    throw new Error(body.error?.message ?? 'The course request could not be completed')
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const teacherCourseApi = {
  async list(token: string) {
    return (await request<{ data: { courses: TeacherCourse[] } }>('', token)).data.courses
  },
  async get(id: string, token: string) {
    return (await request<{ data: { course: TeacherCourse } }>(`/${id}`, token)).data.course
  },
  async create(input: CourseInput, token: string) {
    return (await request<{ data: { course: TeacherCourse } }>('', token, { method: 'POST', body: JSON.stringify(input) })).data.course
  },
  async update(id: string, input: CourseInput, token: string) {
    return (await request<{ data: { course: TeacherCourse } }>(`/${id}`, token, { method: 'PUT', body: JSON.stringify(input) })).data.course
  },
  async delete(id: string, token: string) {
    await request<void>(`/${id}`, token, { method: 'DELETE' })
  },
}
