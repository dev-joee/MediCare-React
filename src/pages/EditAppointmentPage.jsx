import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PencilLine } from 'lucide-react'
import { AppointmentForm } from '../components/appointments/AppointmentForm'
import { Button, buttonVariants } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ErrorAlert } from '../components/ui/alert'
import { Skeleton } from '../components/ui/skeleton'
import { useToast } from '../components/ui/toast'
import { cn } from '../lib/utils'
import { getAppointmentById, getDoctors, updateAppointment } from '../services/api'

function EditSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
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
        <Skeleton className="h-10 w-40" />
      </CardContent>
    </Card>
  )
}

export default function EditAppointmentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [appointment, setAppointment] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setAppointment(null)
    Promise.all([getAppointmentById(id), getDoctors()])
      .then(([appointmentData, doctorList]) => {
        setAppointment(appointmentData)
        setDoctors(doctorList)
      })
      .catch((err) => {
        setError(err.response?.status === 404 ? 'not-found' : 'network')
      })
      .finally(() => setLoading(false))
  }, [id])

  const loadAppointment = () => {
    setLoading(true)
    setError(null)
    getAppointmentById(id)
      .then(setAppointment)
      .catch(() => setError('network'))
      .finally(() => setLoading(false))
  }

  if (error === 'not-found') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <ErrorAlert
          title="Appointment not found."
          message="This appointment does not exist or has already been cancelled."
        />
        <Link to="/appointments" className={cn(buttonVariants({ variant: 'outline' }))}>
          Back to my appointments
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <ErrorAlert
          title="Unable to load the appointment."
          message="Please check that the API server is running, then try again."
          onRetry={loadAppointment}
        />
      </div>
    )
  }

  // Loading includes the brief moment before the first fetch resolves:
  // the form below must only render once the appointment is loaded.
  if (loading || !appointment) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-8 w-52" />
        <EditSkeleton />
      </div>
    )
  }

  // The appointment is guaranteed to be loaded here, so this handler can
  // safely read its fields. Keep it below the guards above.
  const onSubmit = (values) => {
    setSubmitting(true)
    updateAppointment(appointment.id, {
      ...values,
      doctorId: Number(values.doctorId),
      status: appointment.status,
    })
      .then(() => {
        toast('Appointment updated successfully.')
        navigate('/appointments')
      })
      .catch(() => {
        toast('Unable to update the appointment. Please try again.', 'error')
        setSubmitting(false)
      })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <PencilLine className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold">Edit appointment</h1>
          <p className="text-sm text-muted-foreground">
            Reschedule or update the details of your visit.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment details</CardTitle>
          <CardDescription>
            Change any field below — your changes are saved with the update button.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentForm
            doctors={doctors}
            defaultValues={{
              patientName: appointment.patientName,
              email: appointment.email,
              phone: appointment.phone,
              doctorId: appointment.doctorId,
              date: appointment.date,
              time: appointment.time,
              note: appointment.note ?? '',
            }}
            onSubmit={onSubmit}
            submitting={submitting}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Discard changes
        </Button>
      </div>
    </div>
  )
}
