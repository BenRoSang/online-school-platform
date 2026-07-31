import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/context/useAuth'
import type { UserRole } from '../features/auth/types/auth'

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: UserRole[] }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="grid flex-1 place-items-center p-8 text-slate-600">Loading session…</div>
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}
