import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { cn } from '../../lib/utils'

// How many cells (pages + ellipses) the page-number section renders.
// Phones get fewer slots so the control never overflows horizontally.
const DESKTOP_SLOTS = 7
const MOBILE_SLOTS = 5
const MOBILE_QUERY = '(max-width: 640px)'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY)
    const onChange = (event) => setIsMobile(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

function range(from, to) {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index)
}

// Builds the tokens rendered between the Prev/Next buttons. The list always
// holds exactly `slots` entries (or every page when they all fit), so the
// page-number section keeps a constant width and the Prev/Next buttons never
// shift as the current page changes, e.g. 1 … 3 [4] 5 … 9.
function getPageItems(current, total, slots) {
  if (total <= slots) {
    return range(1, total)
  }

  const edge = slots - 3
  if (current <= edge) {
    return [...range(1, slots - 2), 'ellipsis-end', total]
  }
  if (current >= total - edge + 1) {
    return [1, 'ellipsis-start', ...range(total - slots + 2, total)]
  }

  const centerCount = slots - 4
  const start = current - Math.floor((centerCount - 1) / 2)
  return [
    1,
    'ellipsis-start',
    ...range(start, start + centerCount - 1),
    'ellipsis-end',
    total,
  ]
}

export function Pagination({ page, totalPages, onPageChange, className }) {
  const isMobile = useIsMobile()
  if (totalPages <= 1) return null

  const slots = Math.min(totalPages, isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS)
  const goTo = (target) => {
    const clamped = Math.min(Math.max(target, 1), totalPages)
    if (clamped !== page) onPageChange(clamped)
  }

  return (
    <nav
      aria-label="Doctor list pagination"
      className={cn('flex items-center justify-center gap-1.5', className)}
    >
      <Button
        variant="outline"
        className="h-9 w-9 shrink-0"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft aria-hidden="true" />
      </Button>

      <div className="flex items-center justify-center gap-1.5">
        {getPageItems(page, totalPages, slots).map((item) =>
          typeof item === 'number' ? (
            <Button
              key={item}
              variant={item === page ? 'default' : 'secondary'}
              className="h-9 w-9 p-0 text-sm"
              onClick={() => goTo(item)}
              aria-label={`Go to page ${item}`}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </Button>
          ) : (
            <span
              key={item}
              aria-hidden="true"
              className="flex h-9 w-9 select-none items-center justify-center text-sm text-muted-foreground"
            >
              …
            </span>
          ),
        )}
      </div>

      <Button
        variant="outline"
        className="h-9 w-9 shrink-0"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  )
}
