import { Link, useNavigate, useParams } from 'react-router-dom'
import { CourseForm } from '../components/forms/CourseForm'
import { useTeacherCourse, useUpdateCourse } from '../features/courses/hooks/useTeacherCourses'
import type { CourseFormValues } from '../features/courses/schemas/courseSchema'

export function EditCoursePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const courseQuery = useTeacherCourse(id)
  const mutation = useUpdateCourse(id ?? '')
  if (courseQuery.isPending) return <div className="mx-auto w-full max-w-3xl px-4 py-16 text-slate-600">Loading course…</div>
  if (courseQuery.isError || !courseQuery.data) return <div className="mx-auto w-full max-w-3xl px-4 py-16"><h1 className="text-3xl font-bold">Course unavailable</h1><p className="mt-3 text-slate-600">The course does not exist or does not belong to you.</p><Link to="/teacher/courses" className="mt-5 inline-block font-semibold text-brand-700">Return to my courses</Link></div>
  const course = courseQuery.data
  const submit = async (values: CourseFormValues) => { await mutation.mutateAsync(values); navigate('/teacher/courses') }
  return <section className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6"><Link to="/teacher/courses" className="text-sm font-semibold text-brand-700">← My courses</Link><h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">Edit course</h1><p className="mt-3 mb-8 text-slate-600">Update details, publish, or archive this course.</p><CourseForm defaultValues={{ title: course.title, slug: course.slug, description: course.description, thumbnailUrl: course.thumbnailUrl ?? '', status: course.status }} submitLabel="Save changes" isSubmitting={mutation.isPending} errorMessage={mutation.error?.message} onSubmit={submit} /></section>
}
