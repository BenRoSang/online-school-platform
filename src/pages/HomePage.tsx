import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Learn with structure',
    description:
      'Follow focused courses, work through lessons, and keep your progress in one place.',
  },
  {
    title: 'Teach what you know',
    description:
      'Build clear course curricula and share YouTube lessons with your students.',
  },
  {
    title: 'Start for free',
    description:
      'Browse published courses and enrol without payment in the first platform release.',
  },
]

export function HomePage() {
  return (
    <>
      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Learn. Create. Progress.
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              A simpler place to teach and learn online.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Online School brings courses, lessons, and learning progress
              together in one welcoming platform for students and teachers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                Create an account
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300 sm:p-10">
            <div
              className="absolute -right-12 -top-12 size-40 rounded-full bg-brand-500/30 blur-3xl"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-brand-100">Coming together</p>
            <p className="mt-4 text-3xl font-bold">Courses that move with you.</p>
            <div className="mt-10 space-y-4">
              {['Organised lessons', 'YouTube video learning', 'Visible progress'].map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl bg-white/10 p-4"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Built for focused learning
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-950">
                {highlight.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                {highlight.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
