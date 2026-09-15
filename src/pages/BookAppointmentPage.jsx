import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CalendarPlus } from 'lucide-react'
import { AppointmentForm } from '../components/appointments/AppointmentForm'
import { AppointmentFormSkeleton } from '../components/appointments/AppointmentFormSkeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ErrorAlert } from '../components/ui/alert'
import { useToast } from '../components/ui/toast'
import { useProfileStore } from '../stores/useProfileStore'
import { createAppointment, getDoctors } from '../services/api'

export default function BookAppointmentPage() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  // The booking form pre-fills patient details from the global profile store.
  const profileName = useProfileStore((state) => state.name)
  const profileEmail = useProfileStore((state) => state.email)
  const profilePhone = useProfileStore((state) => state.phone)

  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadDoctors = () => {
    setLoading(true)
    setError(null)
    getDoctors()
      .then(setDoctors)
      .catch(() => setError('network'))
      .finally(() => setLoading(false))
  }

  useEffect(loadDoctors, [])

  const defaultValues = {
    patientName: profileName || '',
    email: profileEmail || '',
    phone: profilePhone || '',
    doctorId: doctorId ?? '',
    date: '',
    time: '',
    note: '',
  }

  const onSubmit = (values) => {
    setSubmitting(true)
    createAppointment({
      ...values,
      doctorId: Number(values.doctorId),
      status: 'scheduled',
    })
      .then(() => {
        toast('Appointment booked successfully.')
        navigate('/appointments')
      })
      .catch(() => {
        toast('Unable to book the appointment. Please try again.', 'error')
        setSubmitting(false)
      })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarPlus className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold">Book an appointment</h1>
          <p className="text-sm text-muted-foreground">
            Fill in your details and pick a time that works for you.
          </p>
        </div>
      </div>

      {loading ? (
        <AppointmentFormSkeleton />
      ) : error ? (
        <>
          <ErrorAlert
            title="Unable to load doctors."
            message="Booking needs the doctor list. Please check that the API server is running, then try again."
            onRetry={loadDoctors}
          />
          <Link to="/doctors" className="text-sm text-primary hover:underline">
            ← Back to doctors
          </Link>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Appointment details</CardTitle>
            <CardDescription>
              Tip: save your details on the{' '}
              <Link to="/profile" className="font-medium text-primary hover:underline">
                Profile page
              </Link>{' '}
              to pre-fill this form next time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentForm
              doctors={doctors}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              submitting={submitting}
              submitLabel="Book appointment"
              submittingLabel="Booking..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
