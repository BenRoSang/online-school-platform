import { Link } from 'react-router-dom'
import type { CourseSummary } from '../../features/courses/types/course'
import { CourseThumbnail } from './CourseThumbnail'

export function CourseCard({ course }: { course: CourseSummary }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={`/courses/${course.slug}`} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
        <CourseThumbnail src={course.thumbnailUrl} title={course.title} className="aspect-[16/9] w-full" />
        <div className="p-5">
          <p className="text-sm font-semibold text-brand-700">{course.teacherName}</p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950 group-hover:text-brand-700">
            {course.title}
          </h2>
          <p className="mt-3 line-clamp-2 leading-6 text-slate-600">{course.description}</p>
          <div className="mt-5 flex gap-4 border-t border-slate-100 pt-4 text-sm font-medium text-slate-500">
            <span>{course.sectionCount} {course.sectionCount === 1 ? 'section' : 'sections'}</span>
            <span>{course.lessonCount} {course.lessonCount === 1 ? 'lesson' : 'lessons'}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
