import { Link } from 'react-router-dom'
import { CalendarDays, Clock, FileText, Phone, User } from 'lucide-react'
import { buttonVariants } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { cn } from '../../lib/utils'
import { DoctorAvatar } from '../doctors/DoctorAvatar'
import { AppointmentStatus } from './AppointmentStatus'

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

// Shows one appointment with its doctor info plus edit and cancel actions.
export function AppointmentCard({ appointment, doctor, onCancel }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-4">
          {doctor ? (
            <DoctorAvatar name={doctor.name} seed={doctor.id} className="h-12 w-12" />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
              N/A
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">
                {doctor ? doctor.name : 'Unknown doctor'}
              </span>
              <AppointmentStatus status={appointment.status} />
            </div>
            {doctor && (
              <p className="mt-0.5 text-sm text-muted-foreground">{doctor.specialty}</p>
            )}
          </div>
        </div>

        <div className="grid gap-2 text-muted-foreground sm:grid-cols-2">
          <DetailRow icon={User} label="Patient">
            <span className="text-foreground">{appointment.patientName}</span>
          </DetailRow>
          <DetailRow icon={Phone} label="Phone">
            <span className="text-foreground">{appointment.phone}</span>
          </DetailRow>
          <DetailRow icon={CalendarDays} label="Date">
            <span className="text-foreground">
              {new Date(`${appointment.date}T00:00:00`).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </DetailRow>
          <DetailRow icon={Clock} label="Time">
            <span className="text-foreground">{appointment.time}</span>
          </DetailRow>
          {appointment.note && (
            <div className="sm:col-span-2">
              <DetailRow icon={FileText} label="Note">
                <span className="italic text-foreground">“{appointment.note}”</span>
              </DetailRow>
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-border pt-4">
          <Link
            to={`/appointments/${appointment.id}/edit`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Edit / Reschedule
          </Link>
          {appointment.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => onCancel(appointment)}
              className={cn(buttonVariants({ variant: 'destructive', size: 'sm' }))}
            >
              Cancel appointment
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
