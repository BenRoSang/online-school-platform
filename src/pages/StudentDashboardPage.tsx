import { useAuth } from '../features/auth/context/useAuth'

export function StudentDashboardPage() {
  const { user } = useAuth()
  return <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-16"><h1 className="text-3xl font-bold">Student dashboard</h1><p className="mt-3 text-slate-600">Welcome, {user?.fullName}. Course tools arrive in later sections.</p></section>
}
