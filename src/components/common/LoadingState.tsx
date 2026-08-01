interface LoadingStateProps { label?: string; cards?: number }

export function LoadingState({ label = 'Loading…', cards = 3 }: LoadingStateProps) {
  return <div role="status" aria-label={label} className="mt-8"><span className="sr-only">{label}</span><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">{Array.from({ length: cards }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200 motion-reduce:animate-none" />)}</div></div>
}
