import { useState } from 'react'
import { CourseCard } from '../components/courses/CourseCard'
import { CourseCardSkeleton } from '../components/courses/CourseCardSkeleton'
import { useCourses } from '../features/courses/hooks/useCourses'

export function CourseCataloguePage() {
  const [search, setSearch] = useState('')
  const normalizedSearch = search.trim()
  const { data: courses, isPending, isError, refetch } = useCourses(normalizedSearch)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Course catalogue</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Find your next course</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">Explore free, structured courses from teachers ready to share what they know.</p>
      </header>

      <div className="mt-10 max-w-xl">
        <label htmlFor="course-search" className="text-sm font-semibold text-slate-800">Search courses</label>
        <div className="relative mt-2">
          <svg className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input id="course-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by course title" className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-950 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100" />
        </div>
      </div>

      <section className="mt-10" aria-live="polite" aria-busy={isPending}>
        {isPending && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => <CourseCardSkeleton key={index} />)}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-bold text-red-900">We couldn't load the courses</h2>
            <p className="mt-2 text-red-700">Check your connection and try again.</p>
            <button type="button" onClick={() => refetch()} className="mt-5 rounded-xl bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800">Try again</button>
          </div>
        )}

        {!isPending && !isError && courses?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-slate-950">{normalizedSearch ? 'No matching courses' : 'No courses published yet'}</h2>
            <p className="mt-2 text-slate-600">{normalizedSearch ? 'Try another title or clear your search.' : 'Please check back soon for new learning opportunities.'}</p>
            {normalizedSearch && <button type="button" onClick={() => setSearch('')} className="mt-5 font-semibold text-brand-700 hover:text-brand-600">Clear search</button>}
          </div>
        )}

        {!isPending && !isError && courses && courses.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </section>
    </div>
  )
}
