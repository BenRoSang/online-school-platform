import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/context/useAuth'
import { registerSchema, type RegisterFormValues } from '../features/auth/schemas/authSchemas'

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', role: 'STUDENT' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      const user = await registerUser(values)
      navigate(user.role === 'TEACHER' ? '/teacher' : '/student', { replace: true })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Registration failed')
    }
  })

  return (
    <section className="grid flex-1 place-items-center px-4 py-16 sm:px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm" noValidate>
        <p className="text-sm font-semibold text-brand-600">Join the school</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Create your account</h1>
        {submitError && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}
        <label className="mt-7 block text-sm font-semibold" htmlFor="fullName">Full name</label>
        <input id="fullName" autoComplete="name" {...register('fullName')} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" />
        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        <label className="mt-5 block text-sm font-semibold" htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" {...register('email')} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        <label className="mt-5 block text-sm font-semibold" htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="new-password" {...register('password')} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        <fieldset className="mt-5"><legend className="text-sm font-semibold">I want to</legend><div className="mt-2 flex gap-5"><label><input type="radio" value="STUDENT" {...register('role')} /> <span className="ml-1">Learn</span></label><label><input type="radio" value="TEACHER" {...register('role')} /> <span className="ml-1">Teach</span></label></div></fieldset>
        <button disabled={isSubmitting} className="mt-7 w-full rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{isSubmitting ? 'Creating account…' : 'Create account'}</button>
        <p className="mt-6 text-sm text-slate-600">Already registered? <Link className="font-semibold text-brand-700 hover:underline" to="/login">Log in</Link></p>
      </form>
    </section>
  )
}
