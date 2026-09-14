import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

// Simple status badge for an appointment.
const styles = {
  scheduled: 'bg-sky-100 text-sky-700 border-transparent',
  completed: 'bg-emerald-100 text-emerald-700 border-transparent',
  cancelled: 'bg-rose-100 text-rose-700 border-transparent',
}

export function AppointmentStatus({ status }) {
  return (
    <Badge variant="outline" className={cn(styles[status], 'capitalize')}>
      {status}
    </Badge>
  )
}
