import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { ErrorAlert } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { selectIsAuthenticated, useAuthStore } from '../stores/useAuthStore'

function FieldError({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="text-sm font-medium text-destructive">
      {message}
    </p>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const [formError, setFormError] = useState(null)

  // The protected page the guard turned them away from, when there was one.
  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } })

  // Already logged in (e.g. they opened /login directly) — nothing to do here.
  if (isAuthenticated) return <Navigate to={from} replace />

  const onSubmit = async (values) => {
    setFormError(null)
    const { error } = await login(values)
    if (error) {
      setFormError(error)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LogIn className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Log in to manage your appointments.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>
            Use the email and password you signed up with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {formError && <ErrorAlert title="Could not log in" message={formError} />}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              <FieldError message={errors.password?.message} />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            New to MediCare?{' '}
            <Link
              to="/signup"
              state={location.state}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
