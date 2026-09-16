import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { cn } from '../../lib/utils'

// Builds the list of tokens to render between the Prev/Next buttons.
// Small ranges show every page; larger ranges collapse the middle into
// ellipses so the control stays compact, e.g. 1 … 4 5 6 … 20.
function getPageItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const items = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) items.push('ellipsis-start')
  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }
  if (end < total - 1) items.push('ellipsis-end')
  items.push(total)

  return items
}

export function Pagination({ page, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null

  const goTo = (target) => {
    const clamped = Math.min(Math.max(target, 1), totalPages)
    if (clamped !== page) onPageChange(clamped)
  }

  return (
    <nav
      aria-label="Doctor list pagination"
      className={cn('flex flex-wrap items-center justify-center gap-1.5', className)}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft aria-hidden="true" />
      </Button>

      {getPageItems(page, totalPages).map((item) =>
        typeof item === 'number' ? (
          <Button
            key={item}
            variant={item === page ? 'default' : 'outline'}
            size="icon"
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
            className="flex h-10 w-9 items-center justify-center text-muted-foreground"
          >
            …
          </span>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  )
}
