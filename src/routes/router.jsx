import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { Skeleton } from '../components/ui/skeleton'

const HomePage = lazy(() => import('../pages/HomePage'))
const DoctorsPage = lazy(() => import('../pages/DoctorsPage'))
const DoctorDetailsPage = lazy(() => import('../pages/DoctorDetailsPage'))
const BookAppointmentPage = lazy(() => import('../pages/BookAppointmentPage'))
const AppointmentsPage = lazy(() => import('../pages/AppointmentsPage'))
const EditAppointmentPage = lazy(() => import('../pages/EditAppointmentPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const SignupPage = lazy(() => import('../pages/SignupPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function PageFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

function delay(page) {
  return (
    <Suspense fallback={<PageFallback />}>
      {page}
    </Suspense>
  )
}

// Pages that require a logged-in user. ProtectedRoute renders the Suspense
// boundary itself for the lazy page it wraps.
function protect(page) {
  return <ProtectedRoute>{delay(page)}</ProtectedRoute>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Public
      { index: true, element: delay(<HomePage />) },
      { path: 'doctors', element: delay(<DoctorsPage />) },
      { path: 'doctors/:id', element: delay(<DoctorDetailsPage />) },
      { path: 'login', element: delay(<LoginPage />) },
      { path: 'signup', element: delay(<SignupPage />) },
      // Requires authentication
      { path: 'book', element: protect(<BookAppointmentPage />) },
      { path: 'book/:doctorId', element: protect(<BookAppointmentPage />) },
      { path: 'appointments', element: protect(<AppointmentsPage />) },
      { path: 'appointments/:id/edit', element: protect(<EditAppointmentPage />) },
      { path: 'profile', element: protect(<ProfilePage />) },
      { path: '*', element: delay(<NotFoundPage />) },
    ],
  },
])
