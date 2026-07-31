import { Outlet } from 'react-router-dom'
import { NavigationBar } from '../components/common/NavigationBar'

export function ApplicationLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NavigationBar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">
          Online School Platform — learn at your own pace.
        </div>
      </footer>
    </div>
  )
}
