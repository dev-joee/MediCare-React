import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { CalendarDays, Clock, Loader2, Mail, Phone, Stethoscope, User } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { cn } from '../../lib/utils'

const FALLBACK_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

function FieldError({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="text-sm font-medium text-destructive">
      {message}
    </p>
  )
}

function todayIsoDate() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

function notInPast(value) {
  return value >= todayIsoDate() || 'Date cannot be in the past'
}

export function AppointmentForm({
  doctors,
  defaultValues,
  onSubmit,
  submitting,
  submitLabel,
  submittingLabel = 'Saving...',
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues })

  const selectedDoctorId = watch('doctorId')
  const selectedDoctor = doctors.find((doctor) => doctor.id === Number(selectedDoctorId))

  const baseSlots = selectedDoctor?.slots ?? FALLBACK_SLOTS
  const slots =
    defaultValues.time && !baseSlots.includes(defaultValues.time)
      ? [...baseSlots, defaultValues.time].sort()
      : baseSlots

  const dateMin = useMemo(() => todayIsoDate(), [])

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="patientName">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Patient name
            </span>
          </Label>
          <Input
            id="patientName"
            placeholder="e.g. Yousef Ali"
            aria-invalid={!!errors.patientName}
            {...register('patientName', {
              required: 'Patient name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
          />
          <FieldError message={errors.patientName?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email
            </span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[\w.+-]+@[\w-]+\.[\w.-]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Phone
            </span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. +20 100 123 4567"
            aria-invalid={!!errors.phone}
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^\+?[\d\s()-]{7,16}$/,
                message: 'Enter a valid phone number (7–15 digits)',
              },
            })}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="doctorId">
            <span className="inline-flex items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5" /> Doctor
            </span>
          </Label>
          <Select
            id="doctorId"
            aria-invalid={!!errors.doctorId}
            {...register('doctorId', {
              required: 'Please choose a doctor',
              validate: (value) => value !== '' || 'Please choose a doctor',
            })}
          >
            <option value="">Select a doctor...</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} — {doctor.specialty}
              </option>
            ))}
          </Select>
          <FieldError message={errors.doctorId?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Date
            </span>
          </Label>
          <Input
            id="date"
            type="date"
            min={dateMin}
            aria-invalid={!!errors.date}
            {...register('date', {
              required: 'Date is required',
              validate: notInPast,
            })}
          />
          <FieldError message={errors.date?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Time
            </span>
          </Label>
          <Select
            id="time"
            aria-invalid={!!errors.time}
            {...register('time', {
              required: 'Please choose a time',
              validate: (value) => value !== '' || 'Please choose a time',
            })}
          >
            <option value="">Select a time...</option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </Select>
          <FieldError message={errors.time?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          rows={3}
          placeholder="Anything the doctor should know before the visit..."
          {...register('note', {
            maxLength: { value: 200, message: 'Note must be 200 characters or fewer' },
          })}
        />
        <FieldError message={errors.note?.message} />
      </div>

      <Button type="submit" disabled={submitting} className={cn('w-full sm:w-auto')}>
        {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
        {submitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  )
}
