import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/context/useAuth'

export function DashboardRedirectPage() {
  const { user } = useAuth()
  const destination = user?.role === 'TEACHER' ? '/teacher' : user?.role === 'STUDENT' ? '/student' : '/profile'
  return <Navigate to={destination} replace />
}
