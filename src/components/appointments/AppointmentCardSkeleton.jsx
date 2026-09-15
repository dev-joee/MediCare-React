import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

// Loading placeholder that mirrors AppointmentCard's layout (doctor avatar,
// name + status badge, specialty, detail grid, note, action buttons).
export function AppointmentCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <Skeleton className="h-4 w-4 shrink-0" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        <div className="flex gap-3 border-t border-border pt-4">
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-9 w-40 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
