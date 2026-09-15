import { Link } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-primary" />
          <span>
            MediCare — React Summer Training final project by Yousef Ali
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <Link to="/doctors" className="hover:text-foreground">
            Doctors
          </Link>
          <Link to="/appointments" className="hover:text-foreground">
            My Appointments
          </Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}
