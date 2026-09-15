import { Card, CardContent, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

// Loading placeholder for the appointment form card (used on both the Book
// and Edit pages): header, a grid of labelled inputs and the submit button.
export function AppointmentFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </CardContent>
    </Card>
  )
}
