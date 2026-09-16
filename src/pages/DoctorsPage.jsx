import { useEffect, useMemo, useState } from 'react'
import { Heart, SearchX } from 'lucide-react'
import { DoctorFilters } from '../components/doctors/DoctorFilters'
import { DoctorList } from '../components/doctors/DoctorList'
import { DoctorCardSkeleton } from '../components/doctors/DoctorCardSkeleton'
import { ErrorAlert } from '../components/ui/alert'
import { Pagination } from '../components/ui/pagination'
import { useDebounce } from '../hooks/useDebounce'
import { useFavoritesStore } from '../stores/useFavoritesStore'
import { getDoctors } from '../services/api'
import { cn } from '../lib/utils'

// Doctors shown per page. The grid is up to 3 columns wide, so 6 fills two full rows
const DOCTORS_PER_PAGE = 6

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
  const [view, setView] = useState('all') // 'all' | 'favorites'

  const favorites = useFavoritesStore((state) => state.favorites)

  const [page, setPage] = useState(1)

  // debounced search
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
      const matchesView = view === 'all' || favorites.includes(doctor.id)
      return matchesSearch && matchesSpecialty && matchesView
    })
  }, [doctors, debouncedSearch, specialty, view, favorites])

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE))

  // Changing the search text or specialty should send the user back to page 1
  // so they never land on a page that no longer exists for the new results.
  const handleSearchChange = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleSpecialtyChange = (value) => {
    setSpecialty(value)
    setPage(1)
  }

  const handleViewChange = (value) => {
    setView(value)
    setPage(1)
  }

  const safePage = Math.min(page, totalPages)

  const pagedDoctors = useMemo(() => {
    const start = (safePage - 1) * DOCTORS_PER_PAGE
    return filteredDoctors.slice(start, start + DOCTORS_PER_PAGE)
  }, [filteredDoctors, safePage])

  // Range shown, used for the "Showing X–Y of Z" summary.
  const rangeStart = filteredDoctors.length === 0 ? 0 : (safePage - 1) * DOCTORS_PER_PAGE + 1
  const rangeEnd = Math.min(safePage * DOCTORS_PER_PAGE, filteredDoctors.length)

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
        onSearchChange={handleSearchChange}
        specialty={specialty}
        onSpecialtyChange={handleSpecialtyChange}
        specialties={specialties}
      />

      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 w-fit" role="group" aria-label="Filter doctors">
        {[
          { value: 'all', label: 'All Doctors' },
          { value: 'favorites', label: 'Favorites' },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleViewChange(option.value)}
            aria-pressed={view === option.value}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              view === option.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading ? (
        <DoctorListSkeleton />
      ) : error ? (
        <ErrorAlert
          title="Unable to load doctors."
          message={error}
          onRetry={loadDoctors}
        />
      ) : filteredDoctors.length === 0 ? (
        view === 'favorites' ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center animate-fade-in-up">
            <Heart className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No favorite doctors yet</p>
            <p className="text-sm text-muted-foreground">
              Tap the heart on a doctor card to save them here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center animate-fade-in-up">
            <SearchX className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No doctors found</p>
            <p className="text-sm text-muted-foreground">
              Try a different name or specialty.
            </p>
          </div>
        )
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {rangeStart}–{rangeEnd} of {filteredDoctors.length}
            {filteredDoctors.length !== doctors.length && ` (filtered from ${doctors.length})`} doctors
          </p>
          <DoctorList doctors={pagedDoctors} />
          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
