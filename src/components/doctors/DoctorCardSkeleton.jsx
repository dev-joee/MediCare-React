import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

// Loading placeholder that mirrors DoctorCard's exact layout (avatar, name,
// specialty badge, rating, description, working days/slots, fee + button), so
// the switch to real cards causes no visible layout jump.
export function DoctorCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 shrink-0" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 shrink-0" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
