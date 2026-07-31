import type { EnrolledCourse } from '../types/enrolment'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request<T>(token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl}/enrolments`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...init.headers },
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
    throw new Error(body.error?.message ?? 'The enrolment request could not be completed')
  }
  return response.json() as Promise<T>
}

export const enrolmentApi = {
  async list(token: string) {
    return (await request<{ data: { courses: EnrolledCourse[] } }>(token)).data.courses
  },
  async create(courseId: string, token: string) {
    await request(token, { method: 'POST', body: JSON.stringify({ courseId }) })
  },
}
