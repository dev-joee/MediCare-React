import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Search,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { buttonVariants } from '../components/ui/button'
import { cn } from '../lib/utils'

// How booking works — shown next to the hero so first-time visitors immediately
// understand the flow.
const steps = [
  {
    icon: Search,
    title: 'Find your doctor',
    text: 'Browse specialists and filter by name or specialty.',
  },
  {
    icon: CalendarPlus,
    title: 'Pick a time',
    text: 'Choose a date and one of the available time slots.',
  },
  {
    icon: CalendarCheck,
    title: 'Confirm your booking',
    text: 'The visit is saved and ready to manage in your appointments.',
  },
]

// The system's main capabilities, one card each.
const features = [
  {
    icon: Stethoscope,
    title: 'Find Qualified Doctors',
    text: 'Browse specialists by name or specialty, with ratings, experience and availability in one place.',
  },
  {
    icon: CalendarPlus,
    title: 'Easy Appointment Booking',
    text: 'Book a visit in a few clicks — your saved profile details pre-fill the booking form.',
  },
  {
    icon: CalendarDays,
    title: 'Manage Your Appointments',
    text: 'View upcoming visits, reschedule or cancel anytime from one simple list.',
  },
  {
    icon: UserRound,
    title: 'Personalized Profile',
    text: 'Save your contact details once and book faster every time.',
  },
]

// Landing page: introduces MediCare and guides visitors toward the doctor
// list, where booking starts. The actual doctor listing lives at /doctors.
export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="grid items-center gap-10 pt-6 lg:grid-cols-2 lg:gap-14" aria-labelledby="hero-title">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/60 px-3 py-1 text-sm font-medium text-accent-foreground">
            <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
            Welcome to MediCare
          </span>
          <h1 id="hero-title" className="text-4xl font-bold leading-tight sm:text-5xl">
            Your Health, <span className="text-primary">Our Priority.</span>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            MediCare is a simple medical booking system. Find the right doctor
            and book your appointment quickly and easily — no phone calls, no
            waiting.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/doctors" className={cn(buttonVariants({ size: 'lg' }))}>
              Find a Doctor
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link to="/book" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
              Book an appointment
            </Link>
          </div>
        </div>

        <Card className="animate-fade-in-up">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <h2 className="text-lg font-semibold">Book in 3 easy steps</h2>
            <ol className="space-y-5">
              {steps.map((step) => (
                <li key={step.title} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section aria-labelledby="features-title">
        <div className="max-w-2xl space-y-2">
          <h2 id="features-title" className="text-2xl font-bold sm:text-3xl">
            Everything you need to manage your visits
          </h2>
          <p className="text-muted-foreground">
            From finding a specialist to keeping track of your bookings.
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="h-full animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
            >
              <Card className="h-full transition-shadow duration-200 hover:shadow-md">
                <CardContent className="space-y-3 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.text}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section aria-labelledby="cta-title" className="rounded-xl bg-accent/60 p-8 text-center sm:p-12">
        <h2 id="cta-title" className="text-2xl font-bold sm:text-3xl">
          Ready to take care of your health?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Browse our specialists and book your next visit in a few clicks.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/doctors" className={cn(buttonVariants({ size: 'lg' }))}>
            Browse Doctors
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link to="/book" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            Book an appointment
          </Link>
        </div>
      </section>
    </div>
  )
}
