import { cva } from 'class-variance-authority'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'

const alertVariants = cva(
  'relative flex w-full flex-col gap-3 rounded-xl border p-4 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:pl-7',
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-card-foreground',
        destructive:
          'border-destructive/30 bg-destructive/5 text-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

// Error-state banner with an optional retry button, e.g. for failed API calls.
export function ErrorAlert({ title, message, onRetry, className }) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant: 'destructive' }), 'animate-fade-in-up', className)}
    >
      <AlertCircle className="h-5 w-5" />
      <div className="pl-7">
        <p className="font-medium">{title}</p>
        <p className="mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" className="self-start" onClick={onRetry}>
          <RefreshCw />
          Try again
        </Button>
      )}
    </div>
  )
}
