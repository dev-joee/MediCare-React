import { cn } from '../../lib/utils'

// Loading placeholder block. A translucent gradient sweeps left-to-right
// (the shimmer) so it clearly reads as "loading". Colors come from theme
// tokens (bg-muted + foreground/10), so it looks right in light and dark mode.
export function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden rounded-lg bg-muted',
        'after:absolute after:inset-0 after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-foreground/10 after:to-transparent',
        className,
      )}
      {...props}
    />
  )
}
