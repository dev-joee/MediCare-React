import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { useProfileSync } from '../../hooks/useProfileSync'

// The `key` remounts <main> on every route change, which replays a short
// fade-in — a lightweight page transition with plain CSS, no animation library.
export default function Layout() {
  const { pathname } = useLocation()

  // Loads the logged-in user's profile from json-server (and drops it on
  // logout) — runs on every route so the Navbar dot is correct everywhere.
  useProfileSync()

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main key={pathname} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 animate-fade-in sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
