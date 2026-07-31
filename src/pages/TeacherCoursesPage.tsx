import { Link } from 'react-router-dom'
import { useDeleteCourse, useTeacherCourses } from '../features/courses/hooks/useTeacherCourses'

const statusStyles = { DRAFT: 'bg-amber-100 text-amber-800', PUBLISHED: 'bg-emerald-100 text-emerald-800', ARCHIVED: 'bg-slate-200 text-slate-700' }

export function TeacherCoursesPage() {
  const { data: courses, isPending, isError, refetch } = useTeacherCourses()
  const deleteCourse = useDeleteCourse()

  const confirmDelete = (id: string, title: string) => {
    if (window.confirm(`Delete “${title}”? This cannot be undone.`)) deleteCourse.mutate(id)
  }

  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Teacher workspace</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">My courses</h1></div><Link to="/teacher/courses/new" className="rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700">Create course</Link></div>

      {deleteCourse.isError && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{deleteCourse.error.message}</p>}
      {isPending && <p className="mt-10 text-slate-600">Loading your courses…</p>}
      {isError && <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6"><p className="font-semibold text-red-900">Your courses could not be loaded.</p><button type="button" onClick={() => refetch()} className="mt-3 font-semibold text-red-700">Try again</button></div>}
      {!isPending && !isError && courses?.length === 0 && <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-xl font-bold text-slate-950">Create your first course</h2><p className="mt-2 text-slate-600">Start with a draft and publish it when it is ready.</p></div>}

      {courses && courses.length > 0 && <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><ul className="divide-y divide-slate-200">{courses.map((course) => <li key={course.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-bold text-slate-950">{course.title}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[course.status]}`}>{course.status.toLowerCase()}</span></div><p className="mt-2 text-sm text-slate-500">{course.sectionCount} sections · {course.lessonCount} lessons · Updated {new Date(course.updatedAt).toLocaleDateString()}</p></div><div className="flex gap-2"><Link to={`/teacher/courses/${course.id}/edit`} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Edit</Link>{course.status === 'DRAFT' && <button type="button" onClick={() => confirmDelete(course.id, course.title)} disabled={deleteCourse.isPending} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Delete</button>}</div></li>)}</ul></div>}
    </section>
  )
}
