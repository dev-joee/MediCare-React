import { useForm } from 'react-hook-form'
import { Mail, Phone, UserRound } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useToast } from '../components/ui/toast'
import { useProfileStore } from '../stores/useProfileStore'

function FieldError({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="text-sm font-medium text-destructive">
      {message}
    </p>
  )
}

export default function ProfilePage() {
  const { toast } = useToast()
  const name = useProfileStore((state) => state.name)
  const email = useProfileStore((state) => state.email)
  const phone = useProfileStore((state) => state.phone)
  const setProfile = useProfileStore((state) => state.setProfile)

  // React Hook Form pre-populated from the Zustand store; on submit the
  // store is updated so the booking form can pre-fill these details.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name, email, phone },
  })

  const onSubmit = (values) => {
    setProfile(values)
    toast('Profile saved.')
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Your details are saved locally and used to pre-fill the booking form.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient details</CardTitle>
          <CardDescription>
            {name ? `Welcome back, ${name}!` : 'Add your details to book faster next time.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5" /> Name
                </span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Yousef Ali"
                aria-invalid={!!errors.name}
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email
                </span>
              </Label>
              <Input
                id="profile-email"
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
              <Label htmlFor="profile-phone">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </span>
              </Label>
              <Input
                id="profile-phone"
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

            <Button type="submit" disabled={isSubmitting}>
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
