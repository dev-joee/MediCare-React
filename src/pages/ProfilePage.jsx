import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Pencil, Phone, UserPlus, UserRound } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ErrorAlert } from '../components/ui/alert'
import { Skeleton } from '../components/ui/skeleton'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useToast } from '../components/ui/toast'
import { useProfileStore, selectIsProfileComplete } from '../stores/useProfileStore'

// Build avatar initials from the saved name:
//   "Yousef Ali"          -> "YA"
//   "  Ahmed   Mohamed "  -> "AM"   (extra spaces collapsed)
//   "John"                -> "J"    (single name)
// First letter of the first word, plus the first letter of the second word
// when one exists. Never throws on empty / spaced input.
function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  const first = words[0][0]
  const second = words.length > 1 ? words[1][0] : ''
  return (first + second).toUpperCase()
}

function FieldError({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="text-sm font-medium text-destructive">
      {message}
    </p>
  )
}

// The profile form (React Hook Form). Reused for both "Add" and "Edit": it is
// pre-filled from the values passed in and reports back through onSave/onCancel
// so the page can switch views. Same validation rules the form has always used.
function ProfileForm({ defaultValues, onSave, onCancel, submitLabel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues })

  return (
    <form noValidate onSubmit={handleSubmit(onSave)} className="space-y-5">
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

// Saved-profile card: avatar initials, name, contact details and an edit action.
function ProfileView({ name, email, phone, onEdit }) {
  return (
    <Card className="animate-fade-in-up">
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
        <div
          aria-hidden="true"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary"
        >
          {getInitials(name)}
        </div>

        <div className="w-full space-y-1">
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="flex items-center justify-center gap-2 break-words text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" /> {email}
          </p>
          <p className="flex items-center justify-center gap-2 break-words text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" /> {phone}
          </p>
        </div>

        <Button onClick={onEdit}>
          <Pencil /> Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}

// Shown when no profile has been saved yet: a clear, non-intrusive prompt
// (no alert()) plus a button that opens the form.
function EmptyProfile({ onAdd }) {
  return (
    <Card className="animate-fade-in-up">
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UserRound className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Profile not set</h2>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Please add your personal information to complete your profile and make
            booking appointments faster.
          </p>
        </div>

        <Button onClick={onAdd}>
          <UserPlus /> Add Profile
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ProfilePage() {
  const { toast } = useToast()
  const name = useProfileStore((state) => state.name)
  const email = useProfileStore((state) => state.email)
  const phone = useProfileStore((state) => state.phone)
  const userId = useProfileStore((state) => state.userId)
  const loading = useProfileStore((state) => state.loading)
  const error = useProfileStore((state) => state.error)
  const loadProfile = useProfileStore((state) => state.loadProfile)
  const saveProfile = useProfileStore((state) => state.saveProfile)
  const isComplete = useProfileStore(selectIsProfileComplete)

  // Local view/edit toggle — no extra route or duplicate state needed.
  const [editing, setEditing] = useState(false)

  // Persists to this user's own record in db.json, then updates the store.
  const handleSave = async (values) => {
    // `isComplete` reflects the state *before* saving, so first save vs. update
    // gives the right message. A successful save also clears the Navbar dot.
    const wasComplete = isComplete
    const { error: saveError } = await saveProfile(values)
    if (saveError) {
      toast('Could not save your profile. Please try again.', 'error')
      return
    }
    setEditing(false)
    toast(wasComplete ? 'Profile updated.' : 'Profile saved.')
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your personal information. Details are saved to your account and
          used to pre-fill the booking form.
        </p>
      </div>

      {error ? (
        <ErrorAlert
          title="Could not load your profile"
          message="Please check that the API server is running, then try again."
          onRetry={() => loadProfile(userId)}
        />
      ) : loading ? (
        <Card className="animate-fade-in-up">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-10 w-36" />
          </CardContent>
        </Card>
      ) : editing ? (
        <Card>
          <CardHeader>
            <CardTitle>{isComplete ? 'Edit profile' : 'Add your details'}</CardTitle>
            <CardDescription>
              These details pre-fill the booking form so you can book faster next time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              defaultValues={{ name, email, phone }}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
              submitLabel={isComplete ? 'Save changes' : 'Save profile'}
            />
          </CardContent>
        </Card>
      ) : isComplete ? (
        <ProfileView name={name} email={email} phone={phone} onEdit={() => setEditing(true)} />
      ) : (
        <EmptyProfile onAdd={() => setEditing(true)} />
      )}
    </div>
  )
}