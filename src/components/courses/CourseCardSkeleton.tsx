export function CourseCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-hidden="true">
      <div className="aspect-[16/9] bg-slate-200" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-6 w-4/5 rounded bg-slate-200" />
        <div className="h-4 rounded bg-slate-100" />
        <div className="h-4 w-3/4 rounded bg-slate-100" />
      </div>
    </div>
  )
}
