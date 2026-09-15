import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CalendarDays, Menu, Stethoscope, User, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useProfileStore, selectIsProfileComplete } from '../../stores/useProfileStore'

const links = [
  { to: '/', label: 'Doctors', icon: Stethoscope, end: true },
  { to: '/appointments', label: 'My Appointments', icon: CalendarDays },
  { to: '/profile', label: 'Profile', icon: User },
]

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Stethoscope className="h-5 w-5" />
      </span>
      <span className="text-lg">
        Medi<span className="text-primary">Care</span>
      </span>
    </Link>
  )
}

// Small red notification dot shown next to "Profile" until a profile is saved.
function ProfileDot() {
  return (
    <>
      <span className="h-2 w-2 shrink-0 rounded-full bg-destructive" aria-hidden="true" />
      <span className="sr-only">(profile incomplete)</span>
    </>
  )
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  // Reactive: the dot shows only while the profile is incomplete and clears
  // itself the moment the profile is saved (same source of truth as the page).
  const profileComplete = useProfileStore(selectIsProfileComplete)

  const linkClassName = ({ isActive }) =>
    cn(
      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
    )

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Brand />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClassName}>
              <link.icon className="h-4 w-4" />
              {link.label}
              {link.to === '/profile' && !profileComplete && <ProfileDot />}
            </NavLink>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground hover:bg-accent/60 hover:text-foreground md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkClassName}
                onClick={() => setMenuOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
                {link.to === '/profile' && !profileComplete && <ProfileDot />}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
