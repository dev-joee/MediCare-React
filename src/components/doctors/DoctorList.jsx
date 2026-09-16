import { DoctorCard } from './DoctorCard'

export function DoctorList({ doctors }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {doctors.map((doctor, index) => (
        <div
          key={doctor.id}
          className="h-full animate-fade-in-up"
          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        >
          <DoctorCard doctor={doctor} />
        </div>
      ))}
    </div>
  )
}
