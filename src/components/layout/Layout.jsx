import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

// The `key` remounts <main> on every route change, which replays a short
// fade-in — a lightweight page transition with plain CSS, no animation library.
export default function Layout() {
  const { pathname } = useLocation()

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
