import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/context/useAuth'
import { useTeacherCourses } from '../features/courses/hooks/useTeacherCourses'

export function TeacherDashboardPage() {
  const { user } = useAuth()
  const { data: courses = [], isPending } = useTeacherCourses()
  const published = courses.filter((course) => course.status === 'PUBLISHED').length
  const drafts = courses.filter((course) => course.status === 'DRAFT').length

  return <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Teacher dashboard</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-bold tracking-tight text-slate-950">Welcome, {user?.fullName}</h1><p className="mt-3 text-slate-600">Create, publish, and maintain your learning catalogue.</p></div><Link to="/teacher/courses/new" className="rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700">Create course</Link></div><div className="mt-10 grid gap-5 sm:grid-cols-3">{[{ label: 'All courses', value: courses.length }, { label: 'Published', value: published }, { label: 'Drafts', value: drafts }].map((stat) => <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-slate-500">{stat.label}</p><p className="mt-2 text-4xl font-bold text-slate-950">{isPending ? '—' : stat.value}</p></div>)}</div><div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold text-slate-950">Course management</h2><p className="mt-2 text-slate-600">Review every course, update its details, or change its publication status.</p><Link to="/teacher/courses" className="mt-5 inline-block font-semibold text-brand-700 hover:text-brand-600">Open my courses →</Link></div></section>
}
