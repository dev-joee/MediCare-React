import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'

// Minimal dialog: renders into document.body, closes on Escape and on
// clicking the overlay. Used for the delete-appointment confirmation.
export function Dialog({ open, onOpenChange, className, children }) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onOpenChange])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg animate-dialog-in',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn('mb-4 flex flex-col gap-2', className)} {...props} />
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />
}

export function DialogDescription({ className, ...props }) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
}

export function DialogFooter({ className, ...props }) {
  return (
    <div className={cn('mt-6 flex justify-end gap-3', className)} {...props} />
  )
}
