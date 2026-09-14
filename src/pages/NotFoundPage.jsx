import { Link } from 'react-router-dom'
import { CalendarPlus, Home, Stethoscope } from 'lucide-react'
import { buttonVariants } from '../components/ui/button'
import { cn } from '../lib/utils'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <span className="text-7xl font-bold text-primary/20">404</span>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className={cn(buttonVariants())}>
          <Home className="h-4 w-4" />
          Go to doctors
        </Link>
        <Link to="/appointments" className={cn(buttonVariants({ variant: 'outline' }))}>
          <CalendarPlus className="h-4 w-4" />
          My appointments
        </Link>
        <Link to="/book" className={cn(buttonVariants({ variant: 'outline' }))}>
          <Stethoscope className="h-4 w-4" />
          Book an appointment
        </Link>
      </div>
    </div>
  )
}
