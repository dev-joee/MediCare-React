import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarPlus } from 'lucide-react'
import { AppointmentCard } from '../components/appointments/AppointmentCard'
import { Button, buttonVariants } from '../components/ui/button'
import { ErrorAlert } from '../components/ui/alert'
import { Skeleton } from '../components/ui/skeleton'
import { useToast } from '../components/ui/toast'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { cn } from '../lib/utils'
import { deleteAppointment, getAppointments, getDoctors } from '../services/api'

function AppointmentsSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-4 rounded-xl border border-border p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-3">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-40" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AppointmentsPage() {
  const { toast } = useToast()

  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const loadData = () => {
    setLoading(true)
    setError(null)
    Promise.all([getAppointments(), getDoctors()])
      .then(([appointmentList, doctorList]) => {
        setAppointments(appointmentList)
        setDoctors(doctorList)
      })
      .catch(() => setError('network'))
      .finally(() => setLoading(false))
  }

  useEffect(loadData, [])

  const doctorById = useMemo(
    () => Object.fromEntries(doctors.map((doctor) => [doctor.id, doctor])),
    [doctors],
  )

  // Most recent appointments first.
  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort((a, b) =>
        `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`),
      ),
    [appointments],
  )

  const confirmCancel = () => {
    if (!cancelTarget) return
    setCancelling(true)
    deleteAppointment(cancelTarget.id)
      .then(() => {
        setAppointments((current) => current.filter((a) => a.id !== cancelTarget.id))
        setCancelTarget(null)
        toast('Appointment cancelled successfully.')
      })
      .catch(() => toast('Unable to cancel the appointment. Please try again.', 'error'))
      .finally(() => setCancelling(false))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My appointments</h1>
          <p className="mt-1 text-muted-foreground">
            Manage, reschedule or cancel your upcoming visits.
          </p>
        </div>
        <Link to="/book" className={cn(buttonVariants())}>
          <CalendarPlus className="h-4 w-4" />
          Book new
        </Link>
      </div>

      {loading ? (
        <AppointmentsSkeleton />
      ) : error ? (
        <ErrorAlert
          title="Unable to load appointments."
          message="Please check that the API server is running, then try again."
          onRetry={loadData}
        />
      ) : sortedAppointments.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CalendarPlus className="h-7 w-7" />
          </span>
          <div>
            <p className="font-medium">No appointments yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Book your first appointment to see it here.
            </p>
          </div>
          <Link to="/book" className={cn(buttonVariants())}>
            Book your first appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              doctor={doctorById[appointment.doctorId]}
              onCancel={setCancelTarget}
            />
          ))}
        </div>
      )}

      <Dialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogHeader>
          <DialogTitle>Cancel this appointment?</DialogTitle>
          <DialogDescription>
            {cancelTarget && (
              <>
                {doctorById[cancelTarget.doctorId]?.name ?? 'Unknown doctor'} on{' '}
                <span className="font-medium text-foreground">{cancelTarget.date}</span> at{' '}
                <span className="font-medium text-foreground">{cancelTarget.time}</span> will be
                permanently removed. This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setCancelTarget(null)}>
            Keep appointment
          </Button>
          <Button variant="destructive" onClick={confirmCancel} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Yes, cancel appointment'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
