import { useEffect, useRef } from 'react'

export function ConfirmationDialog({ open, title, description, confirmLabel = 'Confirm', busy = false, onCancel, onConfirm }: { open: boolean; title: string; description: string; confirmLabel?: string; busy?: boolean; onCancel: () => void; onConfirm: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !busy) onCancel() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [busy, onCancel, open])
  if (!open) return null
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel() }}><div role="alertdialog" aria-modal="true" aria-labelledby="confirmation-title" aria-describedby="confirmation-description" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h2 id="confirmation-title" className="text-xl font-bold text-slate-950">{title}</h2><p id="confirmation-description" className="mt-3 text-slate-600">{description}</p><div className="mt-6 flex justify-end gap-3"><button ref={cancelRef} type="button" disabled={busy} onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700">Cancel</button><button type="button" disabled={busy} onClick={onConfirm} className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-60">{busy ? 'Working…' : confirmLabel}</button></div></div></div>
}
