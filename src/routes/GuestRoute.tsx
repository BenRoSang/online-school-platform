import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/context/useAuth'

export function GuestRoute() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="grid flex-1 place-items-center p-8">Loading session…</div>
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}
