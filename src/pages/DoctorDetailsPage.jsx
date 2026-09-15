import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarDays, Clock, Mail, MapPin, Phone, Star, UserRound } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { buttonVariants } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { ErrorAlert } from '../components/ui/alert'
import { Skeleton } from '../components/ui/skeleton'
import { DoctorAvatar } from '../components/doctors/DoctorAvatar'
import { cn } from '../lib/utils'
import { getDoctorById } from '../services/api'

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

// Loading placeholder mirroring the doctor details card (header, description,
// detail grid, time-slot pills, fee + book button).
function DoctorDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Skeleton className="h-4 w-28" />
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <div className="space-y-2 pt-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg bg-accent/60 p-4 sm:grid-cols-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-48" />
            ))}
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-16 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-5">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-11 w-44 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DoctorDetailsPage() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setDoctor(null)
    getDoctorById(id)
      .then(setDoctor)
      .catch((err) => {
        // json-server returns 404 when the doctor does not exist.
        setError(err.response?.status === 404 ? 'not-found' : 'network')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <DoctorDetailsSkeleton />
  }

  if (error === 'not-found') {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <ErrorAlert title="Doctor not found." message="This doctor does not exist or has been removed." />
        <Link to="/" className={cn(buttonVariants({ variant: 'outline' }))}>
          Back to doctors
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <ErrorAlert
          title="Unable to load doctor details."
          message="Please check that the API server is running, then try again."
          onRetry={() => {
            setLoading(true)
            setError(null)
            getDoctorById(id)
              .then(setDoctor)
              .catch(() => setError('network'))
              .finally(() => setLoading(false))
          }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to doctors
      </Link>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <DoctorAvatar name={doctor.name} seed={doctor.id} className="h-24 w-24 text-2xl" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">{doctor.name}</h1>
                <Badge>{doctor.specialty}</Badge>
                <span className="flex items-center gap-1 text-sm font-medium">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {doctor.rating}
                </span>
              </div>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {doctor.description}
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg bg-accent/60 p-4 sm:grid-cols-2">
            <Detail icon={UserRound} label="Experience" value={`${doctor.experienceYears} years`} />
            <Detail icon={CalendarDays} label="Working days" value={doctor.workingDays.join(', ')} />
            <Detail icon={Phone} label="Phone" value={doctor.phone} />
            <Detail icon={Mail} label="Email" value={doctor.email} />
            <div className="sm:col-span-2">
              <Detail icon={MapPin} label="Location" value={doctor.location} />
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              Available time slots
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {doctor.slots.map((slot) => (
                <span
                  key={slot}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-5">
            <span className="text-lg font-semibold">${doctor.consultationFee} / visit</span>
            <Link
              to={`/book/${doctor.id}`}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Book Appointment
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
