import { useAuth } from '../features/auth/context/useAuth'
import { Link } from 'react-router-dom'
import { useEnrolments } from '../features/enrolments/hooks/useEnrolments'

export function StudentDashboardPage() {
  const { user } = useAuth()
  const { data: courses = [], isPending } = useEnrolments()
  return <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Student dashboard</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Welcome, {user?.fullName}</h1><p className="mt-3 text-slate-600">Pick up where you left off or discover something new.</p><div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-sm font-semibold text-slate-500">Enrolled courses</p><p className="mt-2 text-4xl font-bold text-slate-950">{isPending ? '—' : courses.length}</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/student/courses" className="rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white">My courses</Link><Link to="/courses" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700">Browse catalogue</Link></div></div></section>
}
