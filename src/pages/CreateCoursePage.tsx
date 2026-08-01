import { Link, useNavigate } from 'react-router-dom'
import { CourseForm } from '../components/forms/CourseForm'
import { useCreateCourse } from '../features/courses/hooks/useTeacherCourses'
import type { CourseFormValues } from '../features/courses/schemas/courseSchema'
import { useToast } from '../features/toasts/useToast'

export function CreateCoursePage() {
  const navigate = useNavigate()
  const mutation = useCreateCourse()
  const { showToast } = useToast()
  const submit = async (values: CourseFormValues) => { await mutation.mutateAsync(values); showToast('Course created'); navigate('/teacher/courses') }
  return <section className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6"><Link to="/teacher/courses" className="text-sm font-semibold text-brand-700">← My courses</Link><h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">Create a course</h1><p className="mt-3 mb-8 text-slate-600">Build the course details now. Curriculum management comes next.</p><CourseForm submitLabel="Create course" isSubmitting={mutation.isPending} errorMessage={mutation.error?.message} onSubmit={submit} /></section>
}
