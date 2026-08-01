import { Link } from 'react-router-dom'
import { CourseThumbnail } from '../components/courses/CourseThumbnail'
import { useEnrolments } from '../features/enrolments/hooks/useEnrolments'
import { useAuth } from '../features/auth/context/useAuth'
import { getRecentLesson } from '../features/progress/utils/recentLesson'
import { LoadingState } from '../components/common/LoadingState'
import { EmptyState } from '../components/common/EmptyState'

export function StudentCoursesPage() {
  const { data: courses, isPending, isError, refetch } = useEnrolments()
  const { user } = useAuth()
  return <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Student workspace</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-bold tracking-tight text-slate-950">My courses</h1><p className="mt-3 text-slate-600">Continue with the courses you have joined.</p></div><Link to="/courses" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">Browse courses</Link></div>
    {isPending && <LoadingState label="Loading enrolled courses" />}
    {isError && <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6"><p className="font-semibold text-red-900">Your enrolled courses could not be loaded.</p><button type="button" onClick={() => refetch()} className="mt-3 font-semibold text-red-700">Try again</button></div>}
    {!isPending && !isError && courses?.length === 0 && <EmptyState title="Your learning journey starts here" description="You have not enrolled in a course yet. Explore the catalogue and choose one that interests you." action={<Link to="/courses" className="inline-block rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700">Explore courses</Link>} />}
    {courses && courses.length > 0 && <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{courses.map((course) => { const recentLessonId = user ? getRecentLesson(user.id, course.id) : null; const continueLessonId = recentLessonId ?? course.firstLessonId; return <article key={course.enrolmentId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><CourseThumbnail src={course.thumbnailUrl} title={course.title} className="aspect-video w-full" /><div className="p-5"><p className="text-sm font-semibold text-brand-700">{course.teacherName}</p><h2 className="mt-2 text-xl font-bold text-slate-950">{course.title}</h2><p className="mt-3 text-sm text-slate-500">{course.completedLessonCount} of {course.lessonCount} lessons complete</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label={`${course.title} progress`} aria-valuenow={course.progressPercentage} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-emerald-500" style={{ width: `${course.progressPercentage}%` }} /></div><p className="mt-1 text-right text-xs font-semibold text-slate-500">{course.progressPercentage}%</p><Link to={continueLessonId ? `/courses/${course.slug}/learn/${continueLessonId}` : `/courses/${course.slug}`} className="mt-4 block rounded-xl bg-brand-600 px-4 py-2.5 text-center font-semibold text-white hover:bg-brand-700">{continueLessonId ? 'Continue learning' : 'View course'}</Link></div></article> })}</div>}
  </section>
}
