import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../features/auth/context/useAuth'
import { useLessonPlayer } from '../features/learning/hooks/useLessonPlayer'
import { LearningApiError } from '../features/learning/services/learningApi'
import { useUpdateProgress } from '../features/progress/hooks/useProgress'
import { saveRecentLesson } from '../features/progress/utils/recentLesson'
import { useToast } from '../features/toasts/useToast'

export function LessonPlayerPage() {
  const { slug, lessonId } = useParams()
  const { user } = useAuth()
  const query = useLessonPlayer(slug, lessonId)
  const progress = useUpdateProgress(slug, lessonId)
  const { showToast } = useToast()

  useEffect(() => {
    if (user?.role === 'STUDENT' && query.data?.enrolled) {
      saveRecentLesson(user.id, query.data.course.id, query.data.lesson.id)
    }
  }, [query.data, user])

  if (query.isPending) return <div className="grid min-h-[70vh] place-items-center text-slate-600">Loading lesson…</div>
  if (query.isError || !query.data) {
    const locked = query.error instanceof LearningApiError && query.error.status === 403
    return <section className="mx-auto w-full max-w-2xl px-4 py-20 text-center"><h1 className="text-3xl font-bold text-slate-950">{locked ? 'Enrolment required' : 'Lesson unavailable'}</h1><p className="mt-3 text-slate-600">{locked ? 'This lesson is available to enrolled students.' : query.error.message}</p><div className="mt-6 flex flex-wrap justify-center gap-3">{!user && locked && <Link to="/login" state={{ from: `/courses/${slug}/learn/${lessonId}` }} className="rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white">Log in</Link>}<Link to={`/courses/${slug}`} className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700">Course details</Link></div></section>
  }

  const { course, lesson, previousLessonId, nextLessonId } = query.data
  return <div className="mx-auto grid w-full max-w-[1500px] flex-1 lg:grid-cols-[320px_1fr]">
    <aside className="border-b border-slate-200 bg-white lg:border-b-0 lg:border-r"><div className="sticky top-0 max-h-[45vh] overflow-y-auto p-5 lg:max-h-screen"><Link to={`/courses/${course.slug}`} className="text-sm font-semibold text-brand-700">← Course details</Link><h1 className="mt-4 text-xl font-bold text-slate-950">{course.title}</h1>{query.data.enrolled && <div className="mt-5"><div className="flex justify-between text-xs font-semibold text-slate-600"><span>Course progress</span><span>{query.data.progressPercentage}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={query.data.progressPercentage} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${query.data.progressPercentage}%` }} /></div></div>}<nav className="mt-6 space-y-5" aria-label="Course curriculum">{course.sections.map((section) => <section key={section.id}><h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">{section.title}</h2><ol className="mt-2 space-y-1">{section.lessons.map((item) => <li key={item.id}>{item.accessible ? <Link to={`/courses/${course.slug}/learn/${item.id}`} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${item.id === lesson.id ? 'bg-brand-50 font-bold text-brand-700' : 'text-slate-700 hover:bg-slate-50'}`}><span>{item.title}{item.isPreview && <span className="ml-2 text-xs text-emerald-700">Preview</span>}</span>{item.completed && <span className="text-emerald-600" aria-label="Completed">✓</span>}</Link> : <span className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-400"><span>{item.title}</span><span aria-label="Locked">🔒</span></span>}</li>)}</ol></section>)}</nav></div></aside>
    <main className="min-w-0 bg-slate-950 text-white"><div className="mx-auto max-w-5xl p-4 sm:p-8 lg:p-10"><div className="aspect-video overflow-hidden rounded-xl bg-black shadow-2xl"><iframe src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeVideoId}`} title={lesson.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div><div className="mt-8"><div className="flex flex-wrap items-center gap-3">{lesson.isPreview && <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">Preview lesson</span>}</div><h2 className="mt-3 text-3xl font-bold tracking-tight">{lesson.title}</h2><p className="mt-4 max-w-3xl leading-7 text-slate-300">{lesson.description}</p>{query.data.enrolled && <div className="mt-6"><button type="button" onClick={() => progress.mutate(!query.data.completed, { onSuccess: () => showToast(query.data.completed ? 'Lesson marked incomplete' : 'Lesson completed') })} disabled={progress.isPending} className={`rounded-xl px-5 py-3 font-semibold disabled:opacity-60 ${query.data.completed ? 'border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'}`}>{progress.isPending ? 'Saving…' : query.data.completed ? 'Mark as incomplete' : 'Mark as complete'}</button>{progress.isError && <p role="alert" className="mt-2 text-sm text-red-300">{progress.error.message}</p>}</div>}<nav className="mt-10 flex justify-between border-t border-white/10 pt-6" aria-label="Lesson navigation">{previousLessonId ? <Link to={`/courses/${course.slug}/learn/${previousLessonId}`} className="rounded-lg border border-white/20 px-4 py-2 font-semibold hover:bg-white/10">← Previous</Link> : <span />}{nextLessonId && <Link to={`/courses/${course.slug}/learn/${nextLessonId}`} className="rounded-lg bg-brand-500 px-4 py-2 font-semibold hover:bg-brand-600">Next →</Link>}</nav></div></div></main>
  </div>
}
