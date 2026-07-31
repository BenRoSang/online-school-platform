import { Link, useNavigate, useParams } from 'react-router-dom'
import { CourseThumbnail } from '../components/courses/CourseThumbnail'
import { useCourse } from '../features/courses/hooks/useCourses'
import { useAuth } from '../features/auth/context/useAuth'
import { useCreateEnrolment, useEnrolments } from '../features/enrolments/hooks/useEnrolments'

export function CourseDetailsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: course, isPending, isError, refetch } = useCourse(slug)
  const enrolments = useEnrolments()
  const createEnrolment = useCreateEnrolment()

  if (isPending) {
    return <div className="mx-auto w-full max-w-6xl animate-pulse px-4 py-12 sm:px-6 lg:px-8"><div className="h-5 w-32 rounded bg-slate-200" /><div className="mt-8 grid gap-10 lg:grid-cols-2"><div className="aspect-video rounded-3xl bg-slate-200" /><div className="space-y-5"><div className="h-10 rounded bg-slate-200" /><div className="h-5 rounded bg-slate-100" /><div className="h-5 w-2/3 rounded bg-slate-100" /></div></div></div>
  }

  if (isError || !course) {
    return <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center"><h1 className="text-3xl font-bold text-slate-950">Course unavailable</h1><p className="mt-3 text-slate-600">This course may not exist or may not be published.</p><div className="mt-6 flex justify-center gap-4"><Link to="/courses" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">Browse courses</Link><button type="button" onClick={() => refetch()} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700">Try again</button></div></div>
  }

  const isEnrolled = enrolments.data?.some((item) => item.id === course.id) ?? false
  const lessons = course.sections.flatMap((section) => section.lessons)
  const firstLesson = lessons[0]
  const enrol = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${course.slug}` } })
      return
    }
    if (user.role === 'STUDENT' && !isEnrolled) await createEnrolment.mutateAsync(course.id)
  }

  return (
    <div className="w-full">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-16">
          <CourseThumbnail src={course.thumbnailUrl} title={course.title} className="aspect-video w-full rounded-3xl shadow-2xl" />
          <div>
            <Link to="/courses" className="text-sm font-semibold text-brand-100 hover:text-white">← Back to courses</Link>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{course.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{course.description}</p>
            <p className="mt-6 font-semibold text-brand-100">Taught by {course.teacherName}</p>
            <div className="mt-5 flex gap-5 text-sm text-slate-300"><span>{course.sectionCount} sections</span><span>{course.lessonCount} lessons</span></div>
            <div className="mt-8">
              {isEnrolled ? firstLesson ? <Link to={`/courses/${course.slug}/learn/${firstLesson.id}`} className="inline-block rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400">Continue learning</Link> : <p className="text-slate-300">You are enrolled. Lessons are coming soon.</p> : user?.role === 'TEACHER' || user?.role === 'ADMIN' ? <p className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-slate-200">Student accounts can enrol in courses.</p> : <button type="button" onClick={() => void enrol()} disabled={createEnrolment.isPending} className="rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-60">{createEnrolment.isPending ? 'Enrolling…' : user ? 'Enrol for free' : 'Log in to enrol'}</button>}
              {createEnrolment.isError && <p role="alert" className="mt-3 text-sm text-red-300">{createEnrolment.error.message}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">Course curriculum</h2>
        {course.sections.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">The curriculum is being prepared.</p>
        ) : (
          <div className="mt-8 space-y-5">
            {course.sections.map((section, sectionIndex) => (
              <section key={section.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4"><p className="text-xs font-bold uppercase tracking-wider text-brand-600">Section {sectionIndex + 1}</p><h3 className="mt-1 text-xl font-bold text-slate-950">{section.title}</h3></div>
                {section.lessons.length === 0 ? <p className="px-6 py-5 text-slate-500">No lessons added yet.</p> : <ol className="divide-y divide-slate-100">{section.lessons.map((lesson, lessonIndex) => <li key={lesson.id} className="flex items-start gap-4 px-6 py-5"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">{lessonIndex + 1}</span><div><div className="flex flex-wrap items-center gap-2">{lesson.isPreview || isEnrolled ? <Link to={`/courses/${course.slug}/learn/${lesson.id}`} className="font-semibold text-slate-900 hover:text-brand-700">{lesson.title}</Link> : <h4 className="font-semibold text-slate-900">{lesson.title}</h4>}{lesson.isPreview && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">Preview</span>}</div><p className="mt-1 text-sm leading-6 text-slate-600">{lesson.description}</p></div></li>)}</ol>}
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
