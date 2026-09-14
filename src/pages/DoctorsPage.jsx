import { useEffect, useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import { DoctorFilters } from '../components/doctors/DoctorFilters'
import { DoctorList } from '../components/doctors/DoctorList'
import { Skeleton } from '../components/ui/skeleton'
import { ErrorAlert } from '../components/ui/alert'
import { getDoctors } from '../services/api'

function DoctorListSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-4 rounded-xl border border-border p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  )
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Search and filter state stays local to this page.
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('all')

  const loadDoctors = () => {
    setLoading(true)
    setError(null)
    getDoctors()
      .then(setDoctors)
      .catch(() => setError('Unable to load doctors. Please check that the API server is running, then try again.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadDoctors, [])

  const specialties = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.specialty))].sort(),
    [doctors],
  )

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase()
    return doctors.filter((doctor) => {
      const matchesSearch = doctor.name.toLowerCase().includes(query)
      const matchesSpecialty = specialty === 'all' || doctor.specialty === specialty
      return matchesSearch && matchesSpecialty
    })
  }, [doctors, search, specialty])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Find your doctor</h1>
        <p className="mt-1 text-muted-foreground">
          Browse our specialists and book an appointment in a few clicks.
        </p>
      </div>

      <DoctorFilters
        search={search}
        onSearchChange={setSearch}
        specialty={specialty}
        onSpecialtyChange={setSpecialty}
        specialties={specialties}
      />

      {loading ? (
        <DoctorListSkeleton />
      ) : error ? (
        <ErrorAlert
          title="Unable to load doctors."
          message={error}
          onRetry={loadDoctors}
        />
      ) : filteredDoctors.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <SearchX className="h-10 w-10 text-muted-foreground" />
          <p className="font-medium">No doctors found</p>
          <p className="text-sm text-muted-foreground">
            Try a different name or specialty.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </p>
          <DoctorList doctors={filteredDoctors} />
        </>
      )}
    </div>
  )
}
