import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/context/useAuth'
import { useStudentDashboard } from '../features/dashboard/hooks/useDashboard'
import { useEnrolments } from '../features/enrolments/hooks/useEnrolments'
import { getRecentLessonRecord } from '../features/progress/utils/recentLesson'

export function StudentDashboardPage() {
  const { user } = useAuth()
  const dashboard = useStudentDashboard()
  const enrolments = useEnrolments()
  const recentCourses = (enrolments.data ?? []).map((course) => ({
    course,
    recent: user ? getRecentLessonRecord(user.id, course.id) : null,
  })).filter((item) => item.recent).sort((a, b) => b.recent!.openedAt.localeCompare(a.recent!.openedAt))
  const continueItem = recentCourses[0] ?? (enrolments.data?.[0] ? { course: enrolments.data[0], recent: null } : null)

  return <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Student dashboard</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Welcome, {user?.fullName}</h1><p className="mt-3 text-slate-600">Pick up where you left off and keep your learning moving.</p>
    {(dashboard.isPending || enrolments.isPending) && <div className="mt-10 grid gap-5 sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200" />)}</div>}
    {(dashboard.isError || enrolments.isError) && <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6"><p className="font-semibold text-red-900">Your dashboard could not be loaded.</p><button type="button" onClick={() => { void dashboard.refetch(); void enrolments.refetch() }} className="mt-3 font-semibold text-red-700">Try again</button></div>}
    {dashboard.data && !enrolments.isPending && !enrolments.isError && <><div className="mt-10 grid gap-5 sm:grid-cols-3">{[{ label: 'Enrolled courses', value: dashboard.data.enrolledCourseCount }, { label: 'Courses in progress', value: dashboard.data.coursesInProgress }, { label: 'Completed lessons', value: dashboard.data.completedLessons }].map((stat) => <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-slate-500">{stat.label}</p><p className="mt-2 text-4xl font-bold text-slate-950">{stat.value}</p></div>)}</div>
      {continueItem ? <div className="mt-8 rounded-2xl bg-slate-950 p-7 text-white"><p className="text-sm font-bold uppercase tracking-wider text-brand-100">Continue learning</p><h2 className="mt-2 text-2xl font-bold">{continueItem.course.title}</h2><p className="mt-2 text-slate-300">{continueItem.course.progressPercentage}% complete</p><Link to={continueItem.recent?.lessonId || continueItem.course.firstLessonId ? `/courses/${continueItem.course.slug}/learn/${continueItem.recent?.lessonId ?? continueItem.course.firstLessonId}` : `/courses/${continueItem.course.slug}`} className="mt-5 inline-block rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white">Continue Learning</Link></div> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><h2 className="text-xl font-bold">No learning activity yet</h2><p className="mt-2 text-slate-600">Enrol in a course to start learning.</p><Link to="/courses" className="mt-5 inline-block font-semibold text-brand-700">Browse courses →</Link></div>}
      {recentCourses.length > 0 && <div className="mt-10"><h2 className="text-2xl font-bold text-slate-950">Recently accessed</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{recentCourses.slice(0, 4).map(({ course, recent }) => <Link key={course.id} to={`/courses/${course.slug}/learn/${recent!.lessonId}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-300"><h3 className="font-bold text-slate-950">{course.title}</h3><p className="mt-2 text-sm text-slate-500">Opened {new Date(recent!.openedAt).toLocaleDateString()}</p></Link>)}</div></div>}
      <div className="mt-8 flex gap-3"><Link to="/student/courses" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700">My courses</Link><Link to="/courses" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700">Browse catalogue</Link></div></>}
  </section>
}
