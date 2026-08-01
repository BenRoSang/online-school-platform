import type { ReactNode } from 'react'

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-10"><h2 className="text-xl font-bold text-slate-950">{title}</h2><p className="mx-auto mt-2 max-w-xl text-slate-600">{description}</p>{action && <div className="mt-5">{action}</div>}</div>
}
