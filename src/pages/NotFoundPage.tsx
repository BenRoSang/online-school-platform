import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="grid flex-1 place-items-center px-4 py-16 text-center sm:px-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">
          404 error
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">
          The page you requested does not exist or may have moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Return home
        </Link>
      </div>
    </section>
  )
}
