import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/context/useAuth'
import { dashboardApi } from '../services/dashboardApi'

export function useStudentDashboard() {
  const { accessToken, user } = useAuth()
  return useQuery({
    queryKey: ['dashboard', 'student', user?.id],
    queryFn: () => dashboardApi.student(accessToken!),
    enabled: Boolean(accessToken && user?.role === 'STUDENT'),
  })
}

export function useTeacherDashboard() {
  const { accessToken, user } = useAuth()
  return useQuery({
    queryKey: ['dashboard', 'teacher', user?.id],
    queryFn: () => dashboardApi.teacher(accessToken!),
    enabled: Boolean(accessToken && user?.role === 'TEACHER'),
  })
}
