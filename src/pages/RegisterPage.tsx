import { Link } from 'react-router-dom'

export function RegisterPage() {
  return (
    <section className="grid flex-1 place-items-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-brand-600">Join the school</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Create your account
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Student and teacher registration will be connected in Section 3.
        </p>
        <div
          className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500"
          role="status"
        >
          Registration form placeholder
        </div>
        <p className="mt-6 text-sm text-slate-600">
          Already registered?{' '}
          <Link className="font-semibold text-brand-700 hover:underline" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </section>
  )
}
