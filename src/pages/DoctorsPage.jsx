import { useEffect, useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import { DoctorFilters } from '../components/doctors/DoctorFilters'
import { DoctorList } from '../components/doctors/DoctorList'
import { DoctorCardSkeleton } from '../components/doctors/DoctorCardSkeleton'
import { ErrorAlert } from '../components/ui/alert'
import { useDebounce } from '../hooks/useDebounce'
import { getDoctors } from '../services/api'

function DoctorListSkeleton() {
  // Same grid as DoctorList so the swap to real cards causes no layout shift.
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <DoctorCardSkeleton key={index} />
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

  // The input reflects `search` instantly, but filtering runs off the debounced
  // value so a fast typist triggers one filter pass instead of one per key.
  // Only the text search is debounced — the specialty dropdown stays immediate.
  const debouncedSearch = useDebounce(search, 400)

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
    const query = debouncedSearch.trim().toLowerCase()
    return doctors.filter((doctor) => {
      const matchesSearch = doctor.name.toLowerCase().includes(query)
      const matchesSpecialty = specialty === 'all' || doctor.specialty === specialty
      return matchesSearch && matchesSpecialty
    })
  }, [doctors, debouncedSearch, specialty])

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
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center animate-fade-in-up">
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
