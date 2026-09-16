import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, useAuthStore } from '../../stores/useAuthStore'

// Route guard for pages that need a logged-in user.
//
// The persisted auth store rehydrates from localStorage synchronously, so the
// answer is already known on the first render — no loading state and no brief
// redirect for a user who is in fact logged in.
export function ProtectedRoute({ children }) {
  const location = useLocation()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  if (!isAuthenticated) {
    // Remember the page they wanted so login can send them back to it.
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
