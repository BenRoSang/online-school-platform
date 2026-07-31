import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <section className="grid flex-1 place-items-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-brand-600">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Log in to your account
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Authentication will be connected to Supabase in Section 3.
        </p>
        <div
          className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500"
          role="status"
        >
          Login form placeholder
        </div>
        <p className="mt-6 text-sm text-slate-600">
          New here?{' '}
          <Link className="font-semibold text-brand-700 hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  )
}
