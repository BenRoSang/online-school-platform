import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { courseSchema, slugifyTitle, type CourseFormValues } from '../../features/courses/schemas/courseSchema'

interface CourseFormProps {
  defaultValues?: CourseFormValues
  submitLabel: string
  errorMessage?: string
  isSubmitting: boolean
  onSubmit: (values: CourseFormValues) => Promise<void>
}

const inputClass = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100'

export function CourseForm({ defaultValues, submitLabel, errorMessage, isSubmitting, onSubmit }: CourseFormProps) {
  const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultValues ?? { title: '', slug: '', description: '', thumbnailUrl: '', status: 'DRAFT' },
  })

  const generateSlug = () => {
    setValue('slug', slugifyTitle(getValues('title')), { shouldDirty: true, shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" noValidate>
      {errorMessage && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{errorMessage}</div>}

      <div><label htmlFor="title" className="text-sm font-semibold text-slate-800">Title</label><input id="title" {...register('title')} className={inputClass} />{errors.title && <p className="mt-2 text-sm text-red-700">{errors.title.message}</p>}</div>

      <div><div className="flex items-center justify-between gap-3"><label htmlFor="slug" className="text-sm font-semibold text-slate-800">Slug</label><button type="button" onClick={generateSlug} className="text-sm font-semibold text-brand-700 hover:text-brand-600">Generate from title</button></div><input id="slug" {...register('slug')} className={inputClass} placeholder="course-title" />{errors.slug && <p className="mt-2 text-sm text-red-700">{errors.slug.message}</p>}</div>

      <div><label htmlFor="description" className="text-sm font-semibold text-slate-800">Description</label><textarea id="description" rows={7} {...register('description')} className={inputClass} />{errors.description && <p className="mt-2 text-sm text-red-700">{errors.description.message}</p>}</div>

      <div><label htmlFor="thumbnailUrl" className="text-sm font-semibold text-slate-800">Thumbnail URL <span className="font-normal text-slate-500">(optional)</span></label><input id="thumbnailUrl" type="url" {...register('thumbnailUrl')} className={inputClass} placeholder="https://example.com/course.jpg" />{errors.thumbnailUrl && <p className="mt-2 text-sm text-red-700">{errors.thumbnailUrl.message}</p>}</div>

      <div><label htmlFor="status" className="text-sm font-semibold text-slate-800">Status</label><select id="status" {...register('status')} className={inputClass}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select><p className="mt-2 text-sm text-slate-500">Published courses appear in the public catalogue. Archived courses remain private.</p></div>

      <button type="submit" disabled={isSubmitting} className="rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Saving…' : submitLabel}</button>
    </form>
  )
}
