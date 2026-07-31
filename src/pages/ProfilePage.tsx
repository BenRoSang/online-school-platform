import { useAuth } from '../features/auth/context/useAuth'

export function ProfilePage() {
  const { user } = useAuth()
  return <section className="mx-auto w-full max-w-3xl flex-1 px-4 py-16"><h1 className="text-3xl font-bold">Profile</h1><dl className="mt-8 rounded-2xl border bg-white p-6"><dt className="text-sm text-slate-500">Name</dt><dd className="font-semibold">{user?.fullName}</dd><dt className="mt-4 text-sm text-slate-500">Email</dt><dd className="font-semibold">{user?.email}</dd><dt className="mt-4 text-sm text-slate-500">Role</dt><dd className="font-semibold capitalize">{user?.role.toLowerCase()}</dd></dl></section>
}
