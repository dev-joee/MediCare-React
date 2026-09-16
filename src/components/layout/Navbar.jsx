import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CalendarDays, Home, LogIn, LogOut, Menu, Moon, Stethoscope, Sun, User, UserPlus, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { buttonVariants } from '../ui/button'
import { useToast } from '../ui/toast'
import { useProfileStore, selectIsProfileComplete } from '../../stores/useProfileStore'
import { selectIsAuthenticated, useAuthStore } from '../../stores/useAuthStore'
import { useThemeStore } from '../../stores/useThemeStore'

// Always visible.
const publicLinks = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
]

// Only meaningful once logged in — both are protected routes.
const privateLinks = [
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

// Light/dark switch. Shows the icon of the theme it switches TO, so the
// available theme is communicated by the icon, not just color.
function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  )
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  // Reactive: the dot shows only while the profile is incomplete and clears
  const profileComplete = useProfileStore(selectIsProfileComplete)
  const profileLoading = useProfileStore((state) => state.loading)
  const showProfileDot = !profileComplete && !profileLoading
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  // Clears the session from the store (and localStorage); the auth selector
  // above re-renders the Navbar.
  const handleSignOut = () => {
    setMenuOpen(false)
    logout()
    toast('You have been logged out.')
    navigate('/')
  }

  const links = isAuthenticated ? [...publicLinks, ...privateLinks] : publicLinks

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
              {link.to === '/profile' && showProfileDot && <ProfileDot />}
            </NavLink>
          ))}
        </div>

        {/* Auth actions (desktop) + theme toggle + mobile menu toggle */}
        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 md:flex">
            {isAuthenticated ? (
              <button type="button" onClick={handleSignOut} className={linkClassName({ isActive: false })}>
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                  <LogIn />
                  Log in
                </Link>
                <Link to="/signup" className={buttonVariants({ variant: 'default', size: 'sm' })}>
                  <UserPlus />
                  Sign up
                </Link>
              </>
            )}
          </div>
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent/60 hover:text-foreground md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-border bg-card px-4 py-3 animate-fade-in md:hidden">
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
                {link.to === '/profile' && showProfileDot && <ProfileDot />}
              </NavLink>
            ))}

            {/* Auth actions, mirroring the desktop row */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleSignOut}
                className={linkClassName({ isActive: false })}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            ) : (
              <>
                <NavLink to="/login" className={linkClassName} onClick={() => setMenuOpen(false)}>
                  <LogIn className="h-4 w-4" />
                  Log in
                </NavLink>
                <NavLink to="/signup" className={linkClassName} onClick={() => setMenuOpen(false)}>
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
