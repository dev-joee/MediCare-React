import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

// Simple status badge for an appointment.
const styles = {
  scheduled: 'bg-sky-100 text-sky-700 border-transparent dark:bg-sky-950 dark:text-sky-300',
  completed:
    'bg-emerald-100 text-emerald-700 border-transparent dark:bg-emerald-950 dark:text-emerald-300',
  cancelled: 'bg-rose-100 text-rose-700 border-transparent dark:bg-rose-950 dark:text-rose-300',
}

export function AppointmentStatus({ status }) {
  return (
    <Badge variant="outline" className={cn(styles[status], 'capitalize')}>
      {status}
    </Badge>
  )
}
