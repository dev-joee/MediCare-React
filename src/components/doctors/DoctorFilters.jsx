import { useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../ui/input'
import { Select } from '../ui/select'

export function DoctorFilters({ search, onSearchChange, specialty, onSpecialtyChange, specialties }) {
  const searchInputRef = useRef(null)

  const clearSearch = () => {
    onSearchChange('')
    searchInputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search doctors by name..."
          aria-label="Search doctors by name"
          className="pl-9 pr-9"
        />
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <Select
        value={specialty}
        onChange={(event) => onSpecialtyChange(event.target.value)}
        aria-label="Filter by specialty"
        className="sm:w-56"
      >
        <option value="all">All specialties</option>
        {specialties.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
    </div>
  )
}
