import { Component, type ErrorInfo, type ReactNode } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Application render error', error, info) }
  render() {
    if (this.state.failed) return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><div className="max-w-md text-center"><h1 className="text-3xl font-bold text-slate-950">Something went wrong</h1><p className="mt-3 text-slate-600">The page could not be displayed. Reload to try again.</p><button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white">Reload page</button></div></main>
    return this.props.children
  }
}
