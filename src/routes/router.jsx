import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { Skeleton } from '../components/ui/skeleton'

const DoctorsPage = lazy(() => import('../pages/DoctorsPage'))
const DoctorDetailsPage = lazy(() => import('../pages/DoctorDetailsPage'))
const BookAppointmentPage = lazy(() => import('../pages/BookAppointmentPage'))
const AppointmentsPage = lazy(() => import('../pages/AppointmentsPage'))
const EditAppointmentPage = lazy(() => import('../pages/EditAppointmentPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: delay(<DoctorsPage />) },
      { path: 'doctors/:id', element: delay(<DoctorDetailsPage />) },
      { path: 'book', element: delay(<BookAppointmentPage />) },
      { path: 'book/:doctorId', element: delay(<BookAppointmentPage />) },
      { path: 'appointments', element: delay(<AppointmentsPage />) },
      { path: 'appointments/:id/edit', element: delay(<EditAppointmentPage />) },
      { path: 'profile', element: delay(<ProfilePage />) },
      { path: '*', element: delay(<NotFoundPage />) },
    ],
  },
])
