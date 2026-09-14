import { cn } from '../../lib/utils'

const palette = [
  'bg-teal-100 text-teal-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
]

function initials(name) {
  return name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

// Deterministic initials avatar — no external images needed.
export function DoctorAvatar({ name, seed = 0, className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold',
        palette[seed % palette.length],
        className,
      )}
    >
      {initials(name)}
    </div>
  )
}
