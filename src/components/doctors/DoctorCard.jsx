import { Link } from 'react-router-dom'
import { CalendarDays, Clock, Star } from 'lucide-react'
import { Badge } from '../ui/badge'
import { buttonVariants } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { cn } from '../../lib/utils'
import { DoctorAvatar } from './DoctorAvatar'

export function DoctorCard({ doctor }) {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-4">
          <DoctorAvatar name={doctor.name} seed={doctor.id} className="h-14 w-14 text-lg" />
          <div className="min-w-0">
            <Link
              to={`/doctors/${doctor.id}`}
              className="font-semibold leading-snug hover:text-primary hover:underline"
            >
              {doctor.name}
            </Link>
            <div className="mt-1.5">
              <Badge>{doctor.specialty}</Badge>
            </div>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1 text-sm font-medium">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {doctor.rating}
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {doctor.description}
        </p>

        <div className="mt-auto space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            {doctor.workingDays.join(' · ')}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            {doctor.slots[0]} – {doctor.slots[doctor.slots.length - 1]}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-semibold">${doctor.consultationFee} / visit</span>
          <Link to={`/doctors/${doctor.id}`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            View details
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
