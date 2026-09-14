import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Global patient profile store.
// Kept intentionally small: only the patient's contact details, shared by the
// Profile page (writes) and the booking form (pre-fills). Everything else in
// the app stays in component-local state.
export const useProfileStore = create(
  persist(
    (set) => ({
      name: '',
      email: '',
      phone: '',
      setProfile: (profile) =>
        set({
          name: profile.name ?? '',
          email: profile.email ?? '',
          phone: profile.phone ?? '',
        }),
    }),
    { name: 'medicare-patient-profile' },
  ),
)
