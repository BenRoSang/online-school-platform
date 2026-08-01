import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ToastContext } from './ToastContext'

interface Toast { id: number; message: string; type: 'success' | 'error' }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now()
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000)
  }, [])
  const value = useMemo(() => ({ showToast }), [showToast])
  return <ToastContext.Provider value={value}>{children}<div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite" aria-atomic="true">{toasts.map((toast) => <div key={toast.id} className={`rounded-xl px-4 py-3 font-semibold text-white shadow-lg ${toast.type === 'success' ? 'bg-emerald-700' : 'bg-red-700'}`}>{toast.message}</div>)}</div></ToastContext.Provider>
}
