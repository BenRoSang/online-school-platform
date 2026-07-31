import { NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-50 text-brand-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
  }`

export function NavigationBar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <NavLink
          to="/"
          className="flex items-center gap-2 text-base font-bold text-slate-950"
          aria-label="Online School Platform home"
        >
          <span
            className="grid size-9 place-items-center rounded-xl bg-brand-600 text-sm text-white"
            aria-hidden="true"
          >
            OS
          </span>
          <span>Online School</span>
        </NavLink>

        <div className="flex items-center gap-1">
          <NavLink to="/login" className={navLinkClass}>
            Log in
          </NavLink>
          <NavLink
            to="/register"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Get started
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
