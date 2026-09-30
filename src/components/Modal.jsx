import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ open, onClose, maxWidth = 'max-w-[420px]', children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={
          'relative max-h-[90vh] w-full overflow-y-auto rounded-card border border-line bg-parchment p-7 shadow-soft sm:p-8 ' +
          maxWidth
        }
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-soft shadow-soft backdrop-blur transition hover:bg-white hover:text-ink"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}
