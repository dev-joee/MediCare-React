import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

const TOAST_LIMIT = 3

const ToastContext = createContext(null)

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
  error: <XCircle className="h-5 w-5 text-destructive" />,
  info: <Info className="h-5 w-5 text-sky-600 dark:text-sky-400" />,
}

function Toast({ toast, onClose }) {
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg animate-toast-in',
        toast.closing && 'opacity-0 translate-x-2 transition-all duration-200',
      )}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        aria-label="Dismiss notification"
        className="rounded-md p-0.5 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Lightweight toast provider: no extra dependency, replaces alert() for
// success and error feedback after API mutations.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
    setToasts((current) => current.map((t) => (t.id === id ? { ...t, closing: true } : t)))
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id))
    }, 200)
  }, [])

  const toast = useCallback(
    (message, type = 'success') => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current.slice(-(TOAST_LIMIT - 1)), { id, message, type }])
      const timer = window.setTimeout(() => dismiss(id), 4000)
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-3">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onClose={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
