import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/context/useAuth'
import { loginSchema, type LoginFormValues } from '../features/auth/schemas/authSchemas'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      const user = await login(values)
      const requestedPath = (location.state as { from?: string } | null)?.from
      const dashboard = user.role === 'TEACHER' ? '/teacher' : user.role === 'STUDENT' ? '/student' : '/profile'
      navigate(requestedPath ?? dashboard, { replace: true })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login failed')
    }
  })

  return (
    <section className="grid flex-1 place-items-center px-4 py-16 sm:px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm" noValidate>
        <p className="text-sm font-semibold text-brand-600">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Log in to your account</h1>
        {submitError && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}
        <label className="mt-7 block text-sm font-semibold" htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" {...register('email')} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" aria-invalid={Boolean(errors.email)} />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        <label className="mt-5 block text-sm font-semibold" htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" {...register('password')} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" aria-invalid={Boolean(errors.password)} />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        <button disabled={isSubmitting} className="mt-7 w-full rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white disabled:opacity-60">
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
        <p className="mt-6 text-sm text-slate-600">New here? <Link className="font-semibold text-brand-700 hover:underline" to="/register">Create an account</Link></p>
      </form>
    </section>
  )
}
