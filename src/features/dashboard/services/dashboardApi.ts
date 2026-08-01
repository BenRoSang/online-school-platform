import type { StudentDashboardSummary, TeacherDashboardSummary } from '../types/dashboard'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function get<T>(role: 'student' | 'teacher', token: string) {
  const response = await fetch(`${apiUrl}/dashboard/${role}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
    throw new Error(body.error?.message ?? 'Dashboard data could not be loaded')
  }
  return (await response.json() as { data: T }).data
}

export const dashboardApi = {
  student: (token: string) => get<StudentDashboardSummary>('student', token),
  teacher: (token: string) => get<TeacherDashboardSummary>('teacher', token),
}
