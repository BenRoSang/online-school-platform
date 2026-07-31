import { useAuth } from '../features/auth/context/useAuth'

export function TeacherDashboardPage() {
  const { user } = useAuth()
  return <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-16"><h1 className="text-3xl font-bold">Teacher dashboard</h1><p className="mt-3 text-slate-600">Welcome, {user?.fullName}. Course management arrives in Section 5.</p></section>
}
